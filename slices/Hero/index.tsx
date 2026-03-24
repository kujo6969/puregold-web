"use client";
import { FC, useEffect, useState } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { Bounded } from "@/components/Bounded";
import { PrismicNextImage } from "@prismicio/next";
import { clsx } from "clsx";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Navbar from "@/components/Navbar";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero: FC<HeroProps> = ({ slice }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [vertically, setVertically] = useState(false);
  // const [count, setCount] = useState(0);
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  useEffect(() => {
    if (!api) {
      return;
    }
    api.on("select", () => {
      setImageIndex(api.selectedScrollSnap());
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const backgroundImage = slice.primary.carousel[imageIndex]?.images.url;

  const handleCarouselList = (index: number) => {
    if (!api) {
      return;
    }
    setImageIndex(index);
    api.scrollTo(index);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVertically(true);
      } else {
        setVertically(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div
        className={clsx("backdrop-blur-md h-dvh bg-cover")}
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundRepeat: "no-repeat",
        }}
      >
        <section
          data-slice-type={slice.slice_type}
          data-slice-variation={slice.variation}
          className={clsx(
            `py-0 h-dvh text-white text-shadow-black/30 text-shadow-lg backdrop-blur-sm`
          )}
        >
          <div className="flex flex-row p-3">
            <Navbar logo={slice.primary.logoimage} />
          </div>
          <Bounded>
            <div
              className={clsx(
                "flex justify-center place-items-center rounded-3xl relative overflow-hidden drop-shadow-xl/70 shadow-2xl cursor-grab",
                vertically && "mt-30"
              )}
            >
              <Carousel
                setApi={setApi}
                plugins={[plugin.current]}
                opts={{ loop: true, align: "center" }}
                orientation={vertically ? "vertical" : "horizontal"}
                className={clsx(vertically && "h-full")}
              >
                <CarouselContent
                  className={clsx(vertically && "flex flex-col h-80")}
                >
                  {slice.primary.carousel.map((item) => (
                    <CarouselItem key={item.images.id}>
                      <PrismicNextImage
                        field={item.images}
                        className="w-full h-full rounded"
                        quality={100}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              <div className="w-full absolute bottom-0 left-0 p-2">
                <ul className="flex flex-row mt-10 justify-end">
                  {slice.primary.carousel.map((item, index) => (
                    <li
                      key={item.images.id}
                      onClick={() => handleCarouselList(index)}
                    >
                      {/* <p className="flex justify-center items-center drop-shadow-xl/50 mx-2 bg-[#729762] text-2xl rounded-[100] cursor-pointer lg:h-20 lg:w-20 border-2 border-[#F0F0F0] duration-300 transitionease-in-out hover:-translate-y-1 hover:scale-110 scale-110 -translate-y-1 animate-bounce">
                        {current + 1}
                      </p> */}
                      <Image
                        loader={() => item.images.url!}
                        src={item.images.url ?? "/images/noimage.png"}
                        alt="Carousel image"
                        width={100}
                        height={100}
                        style={{ objectFit: "cover" }}
                        className={clsx(
                          "h-10 w-10 drop-shadow-xl/50 mx-2 bg-cover rounded-[100] cursor-pointer lg:h-20 lg:w-20 border-2 border-[#F0F0F0] duration-300 transitionease-in-out hover:-translate-y-1 hover:scale-110",
                          index === current
                            ? "scale-110 -translate-y-1 animate-bounce"
                            : ""
                        )}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Bounded>
        </section>
      </div>
    </>
  );
};

export default Hero;
