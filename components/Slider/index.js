import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "../../lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "../ui/card";

const images = [
  "https://static.asianpaints.com/content/dam/asian_paints/home/homepage-banner-desktop-1x.webp",
  "https://static.asianpaints.com/content/dam/asian_paints/home/homepage-banner-desktop-1x.webp",
  "/assets/profilebg.jpg",
  "/assets/img/1738653394210.png",
];

const Slider = () => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <>
      <Carousel
        plugins={[
          plugin.current,
          Autoplay({
            delay: 4000,
          }),
        ]}
        setApi={setApi}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="w-full">
              <Card className="p-0 m-0 border-none outline-none">
                <CardContent className="p-0">
                  <Image
                    src={image}
                    width={1600}
                    height={600}
                    alt="carousel"
                    className="w-full h-[600px] object-cover -lg:h-[300px]"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="border-none bg-secondary-foreground hover:bg-secondary hover:scale-125" />
        <CarouselNext className="border-none bg-secondary-foreground hover:bg-secondary hover:scale-125" />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground flex flex-row gap-2 items-center justify-center">
        {/* Slide {current} of {count} */}
        {Array.from({ length: count }).map((item, i) => (
          <span
            key={i}
            className={cn(
              "h-1 w-1 p-1 bg-primary rounded-full transition duration-300 ease-in-out",
              i + 1 === current ? "bg-secondary px-[10px]" : ""
            )}
            // onClick={() => setCurrent(i + 1)}
          />
        ))}
      </div>
    </>
  );
};

export default Slider;
