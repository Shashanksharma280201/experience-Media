"use client";
// Adapted from Aceternity UI — Hero Parallax
// https://ui.aceternity.com/components/hero-parallax

import React from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "motion/react";

export type ParallaxProduct = {
  title: string;
  link: string;
  thumbnail: string;
};

export const HeroParallax = ({
  products,
  heading,
  subheading,
  eyebrow,
}: {
  products: ParallaxProduct[];
  heading: React.ReactNode;
  subheading?: string;
  eyebrow?: string;
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 200]), springConfig);

  return (
    <div
      ref={ref}
      className="relative flex h-[300vh] flex-col self-auto overflow-hidden py-40 antialiased [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header heading={heading} subheading={subheading} eyebrow={eyebrow} />
      <motion.div style={{ rotateX, rotateZ, translateY, opacity }}>
        <motion.div className="mb-20 flex flex-row-reverse space-x-20 space-x-reverse">
          {firstRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="mb-20 flex flex-row space-x-20">
          {secondRow.map((product) => (
            <ProductCard product={product} translate={translateXReverse} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-20 space-x-reverse">
          {thirdRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

const Header = ({
  heading,
  subheading,
  eyebrow,
}: {
  heading: React.ReactNode;
  subheading?: string;
  eyebrow?: string;
}) => (
  <div className="relative left-0 top-0 mx-auto w-full max-w-[1600px] px-5 py-20 md:px-10">
    {eyebrow && <p className="eyebrow text-accent">{eyebrow}</p>}
    <h1 className="display mt-6 text-[clamp(3rem,12vw,11rem)]">{heading}</h1>
    {subheading && <p className="mt-8 max-w-xl text-ink-soft">{subheading}</p>}
  </div>
);

const ProductCard = ({
  product,
  translate,
}: {
  product: ParallaxProduct;
  translate: MotionValue<number>;
}) => (
  <motion.div
    style={{ x: translate }}
    whileHover={{ y: -16 }}
    key={product.title}
    className="group/product relative h-72 w-[24rem] shrink-0 overflow-hidden rounded-sm border border-line bg-night"
  >
    <a href={product.link} target="_blank" rel="noopener noreferrer" className="relative block h-full w-full">
      <Image
        src={product.thumbnail}
        fill
        sizes="24rem"
        className="object-cover transition-transform duration-500 group-hover/product:scale-105"
        alt={product.title}
      />
    </a>
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity group-hover/product:opacity-100" />
    <h2 className="eyebrow pointer-events-none absolute bottom-4 left-4 text-paper opacity-0 transition-opacity group-hover/product:opacity-100">
      {product.title}
    </h2>
  </motion.div>
);
