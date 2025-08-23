'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../../../components/ui/card';
import { Alert, AlertDescription } from '../../../../../components/ui/alert';
import { Textarea } from '../../../../../components/ui/textarea';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '../../../../../lib/api';
import AsideContainer from '../../../../../components/AsideContainer';
import { SidebarTrigger } from '../../../../../components/ui/sidebar';
import { Separator } from '../../../../../components/ui/separator';
import { Badge } from '../../../../../components/ui/badge';
import { MdCheckBoxOutlineBlank } from 'react-icons/md';
import {
  IoIosArrowBack,
  IoMdCheckboxOutline,
  IoMdCheckbox,
  IoMdInformationCircleOutline,
} from 'react-icons/io';
import {
  MdError,
  MdCheckCircle,
  MdWarning,
  MdInventory2,
  MdReceipt,
} from 'react-icons/md';

// Enhanced validation schema
const schema = yup.object().shape({
  materials: yup.array().of(
    yup.object().shape({
      materialId: yup.string().required('Material ID is required'),
      quantityReceived: yup
        .number()
        .transform((value, originalValue) => {
          // Handle empty strings and null/undefined values
          if (
            originalValue === '' ||
            originalValue === null ||
            originalValue === undefined
          ) {
            return undefined;
          }
          return value;
        })
        .min(0, 'Must be 0 or greater')
        .test('valid-decimal', 'Invalid quantity format', function (value) {
          // Allow undefined for completed items
          if (value === undefined) return true;
          return Number.isFinite(value) && value >= 0;
        })
        .test(
          'not-exceed-remaining',
          'Received quantity cannot exceed remaining quantity',
          function (value) {
            // Skip test if value is undefined (completed items)
            if (value === undefined) return true;

            const orderedQty = this.parent.orderedQty;
            const alreadyReceived = this.parent.alreadyReceived || 0;
            const remainingQty = orderedQty - alreadyReceived;

            // If item is completed, skip validation
            if (remainingQty <= 0) return true;

            return value <= remainingQty;
          }
        ),
      remarks: yup
        .string()
        .max(500, 'Remarks cannot exceed 500 characters')
        .optional(),
      // Helper fields for validation
      orderedQty: yup.number().optional(),
      alreadyReceived: yup.number().optional(),
      isCompleted: yup.boolean().optional(),
    })
  ),
});

const colors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Partial: 'bg-violet-100 text-violet-700',
  'Partially received': 'bg-violet-100 text-violet-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  Complete: 'bg-blue-100 text-blue-700',
};

const capitalizeFirst = str => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default function ReceiveMaterialForm() {
  const { slug } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [materialsData, setMaterialsData] = useState([]);

  // Fetch request details with error handling
  const {
    data: request,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['materialrequest', slug],
    queryFn: async () => {
      try {
        const response = await api.get(`/materialrequest/getorderbyid/${slug}`);
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || 'Failed to fetch material request'
        );
      }
    },
    retry: 2,
    retryDelay: 1000,
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      materials: [],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: 'materials',
  });

  const watchedMaterials = watch('materials');

  // Helper function to check if item is fully received
  const isItemFullyReceived = (orderedQty, alreadyReceived) => {
    return orderedQty <= (alreadyReceived || 0);
  };

  // Helper function to get remaining quantity
  const getRemainingQuantity = (orderedQty, alreadyReceived) => {
    return Math.max(0, orderedQty - (alreadyReceived || 0));
  };

  useEffect(() => {
    if (request?.materials) {
      // Group received materials by materialId
      const receivedMap = new Map();

      (request.receivedItems || []).forEach(rm => {
        const key = rm.item.toString();
        if (!receivedMap.has(key)) {
          receivedMap.set(key, {
            totalReceived: rm.quantity || 0,
            remarks: rm.remarks || '',
          });
        } else {
          const existing = receivedMap.get(key);
          receivedMap.set(key, {
            totalReceived: existing.totalReceived + (rm.quantity || 0),
            remarks: [existing.remarks, rm.remarks].filter(Boolean).join(' | '),
          });
        }
      });

      const processedMaterialsData = request.materials.map(m => {
        const received = receivedMap.get(m.item._id.toString());
        const alreadyReceived = received?.totalReceived || 0;
        const isCompleted = isItemFullyReceived(m.quantity, alreadyReceived);

        return {
          materialId: m.item._id,
          name: m.item.name,
          description: m.item.description || '',
          unit: m.unit,
          orderedQty: m.quantity,
          alreadyReceived,
          quantityReceived: isCompleted ? '' : '', // Set empty string for all items initially
          remarks: '',
          supplier: m.supplier || 'N/A',
          isCompleted,
          remainingQty: getRemainingQuantity(m.quantity, alreadyReceived),
        };
      });

      setMaterialsData(processedMaterialsData);

      reset({
        materials: processedMaterialsData,
      });
    }
  }, [request, reset]);

  // Enhanced mutation with better error handling
  const mutation = useMutation({
    mutationFn: async data => {
      const response = await api.put(
        `/materialrequest/receivematerials/${slug}`,
        data
      );
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries(['materialrequest', slug]);
      queryClient.invalidateQueries(['materialrequests']);
      toast.success('Materials received successfully!', {
        // description: `${data.receivedCount || 0} items processed`,
      });
    },
    onError: error => {
      const message =
        error.response?.data?.message || 'Failed to receive materials';
      toast.error('Error receiving materials', {
        description: message,
      });
    },
  });

  const onSubmit = data => {
    // Filter out completed items and items with no quantity
    const receivedMaterials = data.materials.filter((item, index) => {
      const materialData = materialsData[index];
      const hasQuantity =
        item.quantityReceived && Number(item.quantityReceived) > 0;
      const isNotCompleted = !materialData?.isCompleted;

      return isNotCompleted && hasQuantity;
    });

    if (receivedMaterials.length === 0) {
      toast.warning('No materials selected', {
        description:
          'Please enter quantities for at least one incomplete material',
      });
      return;
    }

    const payload = {
      materials: receivedMaterials.map(item => ({
        materialId: item.materialId,
        quantity: Number(item.quantityReceived),
        remarks: item.remarks || '',
      })),
      receivedBy: 'current-user',
      receivedDate: new Date().toISOString(),
    };

    mutation.mutate(payload);
  };

  // Utility functions
  const toggleItemSelection = index => {
    const material = materialsData[index];
    // Don't allow selection of completed items
    if (material?.isCompleted) return;

    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
  };

  const selectAllItems = () => {
    // Only select incomplete items
    const incompleteIndices = materialsData
      .map((material, index) => ({ material, index }))
      .filter(({ material }) => !material.isCompleted)
      .map(({ index }) => index);

    if (selectedItems.size === incompleteIndices.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(incompleteIndices));
    }
  };

  const getTotalStats = () => {
    const incompleteItems = materialsData.filter(item => !item.isCompleted);
    const totalOrdered =
      incompleteItems.reduce(
        (sum, item) => sum + (item.remainingQty || 0),
        0
      ) || 0;
    const totalReceived =
      watchedMaterials?.reduce((sum, item, index) => {
        const materialData = materialsData[index];
        if (materialData?.isCompleted) return sum;
        const qty = Number(item.quantityReceived) || 0;
        return sum + qty;
      }, 0) || 0;
    const itemsWithQuantity =
      watchedMaterials?.filter((item, index) => {
        const materialData = materialsData[index];
        const qty = Number(item.quantityReceived) || 0;
        return !materialData?.isCompleted && qty > 0;
      }).length || 0;

    return {
      totalOrdered,
      totalReceived,
      itemsWithQuantity,
      incompleteItems: incompleteItems.length,
    };
  };

  const getCompletionStatus = (ordered, received, alreadyReceived) => {
    const totalReceived = received + alreadyReceived;
    const percentage = ordered > 0 ? (totalReceived / ordered) * 100 : 0;

    if (percentage >= 100) return { status: 'complete', color: 'bg-green-500' };
    if (percentage === 0) return { status: 'pending', color: 'bg-gray-500' };
    return { status: 'partial', color: 'bg-yellow-500' };
  };

  const stats = getTotalStats();

  // Loading state
  if (isLoading) {
    return (
      <AsideContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading material request...</p>
          </div>
        </div>
      </AsideContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <AsideContainer>
        <Alert className="m-4">
          <MdError className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load material request: {error.message}</span>
            <Button variant="outline" size="sm" onClick={refetch}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </AsideContainer>
    );
  }

  const filteredFields = showOnlySelected
    ? fields.filter((_, index) => selectedItems.has(index))
    : fields;

  return (
    <AsideContainer>
      {/* Header */}
      <div className="flex w-full items-center gap-2 my-4">
        <SidebarTrigger className="-ml-2 hover:bg-primary" />
        <Separator orientation="vertical" className="h-4 bg-black" />
        <IoIosArrowBack
          className="text-2xl cursor-pointer transition-transform duration-300 hover:scale-125 text-muted-foreground hover:text-foreground"
          onClick={() => router.back()}
          aria-label="Go back"
        />
        <div className="flex-1">
          <h1 className="font-ubuntu font-bold text-xl md:text-2xl leading-7 truncate flex items-center gap-2">
            {/* <MdInventory2 className="text-secondary" /> */}
            Receive Materials
          </h1>
          {request?.requestNumber && (
            <p className="text-sm text-muted-foreground">
              Request #{request.requestNumber} •{' '}
              {request.supplier || 'Multiple Suppliers'}
            </p>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MdReceipt className="text-5xl text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{fields.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MdInventory2 className="text-5xl text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Incomplete Items
                </p>
                <p className="text-2xl font-bold">{stats.incompleteItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MdCheckCircle className="text-5xl text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Items with Quantity
                </p>
                <p className="text-2xl font-bold">{stats.itemsWithQuantity}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MdWarning className="text-5xl text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-2xl font-bold">
                  {stats.totalOrdered > 0
                    ? Math.round(
                        (stats.totalReceived / stats.totalOrdered) * 100
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MdInventory2 />
              Materials ({filteredFields.length} items)
              {stats.incompleteItems < fields.length && (
                <Badge variant="secondary" className="ml-2">
                  {fields.length - stats.incompleteItems} completed
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>

            {/* Mobile/Desktop Headers */}
            <div className="hidden md:grid md:grid-cols-12 gap-2 items-center p-3 bg-muted/50 rounded-lg mb-4 text-sm font-medium text-center">
              {/* <div className="col-span-1">Select</div> */}
              <div className="col-span-2">Material</div>
              <div className="col-span-1">Ordered</div>
              <div className="col-span-1">Unit</div>
              <div className="col-span-1 text-wrap">Already Received</div>
              <div className="col-span-2">Received</div>
              <div className="col-span-3">Remarks</div>
              <div className="col-span-1">Status</div>
            </div>

            <div className="space-y-4">
              {filteredFields.map((field, index) => {
                const actualIndex = showOnlySelected
                  ? fields.findIndex(f => f.id === field.id)
                  : index;

                const material = watchedMaterials?.[actualIndex];
                const materialData = materialsData[actualIndex];
                const isCompleted = materialData?.isCompleted || false;
                const completion = getCompletionStatus(
                  material?.orderedQty || 0,
                  Number(material?.quantityReceived) || 0,
                  material?.alreadyReceived || 0
                );

                return (
                  <Card
                    key={field.id}
                    className={`overflow-hidden ${
                      isCompleted ? 'opacity-60' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      {/* Mobile Layout */}
                      <div className="md:hidden space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <button
                                type="button"
                                onClick={() => toggleItemSelection(actualIndex)}
                                className={`p-1 rounded hover:bg-muted ${
                                  isCompleted ? 'cursor-not-allowed' : ''
                                }`}
                                disabled={isCompleted}
                              >
                                {selectedItems.has(actualIndex) ? (
                                  <IoMdCheckbox className="text-primary text-xl" />
                                ) : (
                                  <IoMdCheckboxOutline className="text-xl" />
                                )}
                              </button>
                              <h4 className="font-medium">{field.name}</h4>
                            </div>
                            {field.description && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {field.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>
                                Ordered: {field.orderedQty} {field.unit}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>
                                Already Received: {field.alreadyReceived}{' '}
                                {field.unit}
                              </span>
                            </div>
                            {!isCompleted && (
                              <div className="flex items-center gap-4 text-sm text-green-600">
                                <span>
                                  Remaining: {materialData?.remainingQty || 0}{' '}
                                  {field.unit}
                                </span>
                              </div>
                            )}
                          </div>
                          <div
                            className={`w-3 h-3 rounded-full ${completion.color}`}
                          />
                        </div>

                        <div className="space-y-3">
                          <div>
                            <Label
                              htmlFor={`materials.${actualIndex}.quantityReceived`}
                              className={`text-sm font-medium ${
                                isCompleted ? 'text-muted-foreground' : ''
                              }`}
                            >
                              Quantity Received
                            </Label>
                            <Controller
                              name={`materials.${actualIndex}.quantityReceived`}
                              control={control}
                              render={({ field: inputField, fieldState }) => (
                                <div>
                                  <Input
                                    {...inputField}
                                    type="number"
                                    min="0"
                                    max={materialData?.remainingQty || 0}
                                    step="0.01"
                                    placeholder={
                                      isCompleted
                                        ? 'Completed'
                                        : 'Enter quantity'
                                    }
                                    disabled={isCompleted}
                                    className={
                                      fieldState.error ? 'border-red-500' : ''
                                    }
                                  />
                                  {fieldState.error && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {fieldState.error.message}
                                    </p>
                                  )}
                                </div>
                              )}
                            />
                          </div>

                          <div>
                            <Label
                              htmlFor={`materials.${actualIndex}.remarks`}
                              className={`text-sm font-medium ${
                                isCompleted ? 'text-muted-foreground' : ''
                              }`}
                            >
                              Remarks (Optional)
                            </Label>
                            <Controller
                              name={`materials.${actualIndex}.remarks`}
                              control={control}
                              render={({ field: inputField }) => (
                                <Textarea
                                  {...inputField}
                                  placeholder={
                                    isCompleted
                                      ? 'Item completed'
                                      : 'Add any remarks about this item...'
                                  }
                                  rows={2}
                                  maxLength={500}
                                  disabled={isCompleted}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:grid md:grid-cols-12 gap-2 items-center">
                        <div className="col-span-2 text-center">
                          <p className="font-medium">{field.name}</p>
                          {field.description && (
                            <p className="text-xs text-muted-foreground truncate">
                              {field.description}
                            </p>
                          )}
                        </div>

                        <div className="col-span-1">
                          <Input
                            value={field.orderedQty}
                            disabled
                            className="text-center"
                          />
                        </div>

                        <div className="col-span-1">
                          <Input
                            value={field.unit}
                            disabled
                            className="text-center"
                          />
                        </div>

                        <div className="col-span-1">
                          <Input
                            value={field.alreadyReceived}
                            disabled
                            className="text-center"
                          />
                        </div>

                        <div className="col-span-2">
                          <Controller
                            name={`materials.${actualIndex}.quantityReceived`}
                            control={control}
                            render={({ field: inputField, fieldState }) => (
                              <div>
                                <Input
                                  {...inputField}
                                  type="number"
                                  min="0"
                                  max={materialData?.remainingQty || 0}
                                  step="0.01"
                                  placeholder={isCompleted ? 'Complete' : 'Qty'}
                                  disabled={isCompleted}
                                  className={
                                    fieldState.error ? 'border-red-500' : ''
                                  }
                                />
                                {fieldState.error && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {fieldState.error.message}
                                  </p>
                                )}
                              </div>
                            )}
                          />
                        </div>

                        <div className="col-span-3">
                          <Controller
                            name={`materials.${actualIndex}.remarks`}
                            control={control}
                            render={({ field: inputField }) => (
                              <Input
                                {...inputField}
                                placeholder={
                                  isCompleted
                                    ? 'Completed'
                                    : 'Remarks (optional)'
                                }
                                maxLength={500}
                                disabled={isCompleted}
                              />
                            )}
                          />
                        </div>

                        <div className="col-span-1 flex justify-center">
                          <Badge
                            className={`${colors?.[capitalizeFirst(completion.status)]}`}
                          >
                            {capitalizeFirst(completion.status)}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  {stats.itemsWithQuantity > 0 && (
                    <p>Ready to receive {stats.itemsWithQuantity} item(s)</p>
                  )}
                  {stats.incompleteItems === 0 && (
                    <p className="text-green-600 font-medium">
                      All items have been fully received!
                    </p>
                  )}
                  {Object.keys(errors).length > 0 && (
                    <p className="text-red-500">
                      Please fix validation errors before submitting
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="hover:bg-secondary"
                    onClick={() => router.back()}
                    disabled={mutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      mutation.isPending ||
                      stats.itemsWithQuantity === 0 ||
                      stats.incompleteItems === 0
                    }
                    className="min-w-48 bg-secondary"
                  >
                    {mutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 " />
                        Processing...
                      </>
                    ) : (
                      <>
                        <MdCheckCircle className="mr-2" />
                        Submit Received Materials
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {filteredFields.length === 0 && showOnlySelected && (
              <div className="text-center py-8 text-muted-foreground">
                <IoMdInformationCircleOutline className="text-4xl mx-auto mb-2" />
                <p>No items selected. Use the checkboxes to select items.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </AsideContainer>
  );
}
