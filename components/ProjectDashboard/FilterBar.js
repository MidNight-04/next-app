import { cn } from '../../lib/utils';
import { SelectDropdown, YesNoDropdown } from './SelectDropdown';
import { MdFilterListOff } from 'react-icons/md';

const FilterBar = ({ filters, dispatch, teammembers = [], siteIds = [] }) => {
  const filterButtons = ['Yesterday', 'Today', 'This Month', 'Last Month'];

  return (
    <>
      <div className="flex flex-wrap justify-center gap-2">
        {filterButtons.map(filter => (
          <span
            key={filter}
            className={cn(
              'flex gap-2 py-1 px-3 rounded-full border cursor-pointer',
              filters.activeFilter === filter
                ? 'text-green-800 bg-green-200 border-green-800'
                : 'bg-primary-foreground text-primary border-primary'
            )}
            onClick={() =>
              dispatch({
                type: 'SET_FILTER',
                field: 'activeFilter',
                value: filter,
              })
            }
          >
            {filter}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2 items-center my-4">
        <SelectDropdown
          placeholder="Assigned To"
          value={filters.employeeId}
          onChange={v =>
            dispatch({ type: 'SET_FILTER', field: 'employeeId', value: v })
          }
          options={teammembers?.map(tm => ({
            value: tm._id,
            label: `${tm.firstname} ${tm.lastname || ''}`,
          }))}
        />

        <SelectDropdown
          placeholder="Site ID"
          value={filters.siteId}
          onChange={v =>
            dispatch({ type: 'SET_FILTER', field: 'siteId', value: v })
          }
          options={siteIds?.map(s => ({ value: s.siteID, label: s.siteID }))}
        />

        <YesNoDropdown
          placeholder="Site Working"
          value={filters.working}
          onChange={v =>
            dispatch({ type: 'SET_FILTER', field: 'working', value: v })
          }
        />
        <YesNoDropdown
          placeholder="Material Available"
          value={filters.mataval}
          onChange={v =>
            dispatch({ type: 'SET_FILTER', field: 'mataval', value: v })
          }
        />
        <YesNoDropdown
          placeholder="Updated OnTime"
          value={filters.onTime}
          onChange={v =>
            dispatch({ type: 'SET_FILTER', field: 'onTime', value: v })
          }
        />

        <SelectDropdown
          placeholder="Branch"
          value={filters.branch}
          onChange={v =>
            dispatch({ type: 'SET_FILTER', field: 'branch', value: v })
          }
          options={[
            { value: 'Gurgaon', label: 'Gurgaon' },
            { value: 'Ranchi', label: 'Ranchi' },
            { value: 'Patna', label: 'Patna' },
          ]}
        />

        <button
          onClick={() => dispatch({ type: 'RESET_FILTERS' })}
          className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-secondary text-primary"
        >
          <MdFilterListOff /> Clear
        </button>
      </div>
    </>
  );
};

export default FilterBar;
