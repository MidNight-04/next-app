"use client";
import dynamic from "next/dynamic";
const Header = dynamic(() => import("../../components/Header"), { ssr: false });
const Footer = dynamic(() => import("../../components/Footer"), { ssr: false });

const Page = () => {
  return (
    <>
      <Header />
      <div>Page</div>
      <Footer />
    </>
  );
};

export default Page;
