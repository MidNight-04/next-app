// import "./index.css";
import Link from "next/link";
import SocialIcons from "../SocialIcons";
import imageUrl from "../../constant/imageUrl";
import Image from "next/image";

const footerMenu = [
  {
    id: 0,
    title: "navigation",
    columns: [
      {
        id: 0,
        sub: [
          {
            id: 0,
            item: "Home",
          },
          {
            id: 1,
            item: "TURNKEY SOLUTIONS",
          },
          {
            id: 2,
            item: "SHOP MATERIALS",
          },
        ],
      },
      {
        id: 1,
        sub: [
          {
            id: 0,
            item: "Become a Franchise",
          },
          {
            id: 1,
            item: "Careers",
          },
          {
            id: 2,
            item: "Contact us",
          },
          {
            id: 3,
            item: "Vendor",
          },
        ],
      },
    ],
  },
  {
    id: 1,
    title: "services",
    columns: [
      {
        id: 0,
        sub: [
          {
            id: 0,
            item: "Home Construction",
          },
          {
            id: 1,
            item: "Construction Project Management",
          },
          {
            id: 2,
            item: "Real Estate",
          },
          {
            id: 3,
            item: "Govt. Civil Contracting",
          },
        ],
      },
      {
        id: 1,
        sub: [
          {
            id: 0,
            item: "Construction Materials ",
          },
          {
            id: 1,
            item: "Engineering and Design",
          },
          {
            id: 2,
            item: "Sustainable Construction",
          },
        ],
      },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="h-[430px] flex flex-col py-8 px-32 bg-secondary text-primary text-center z-50 justify-between -lg:px-4 -lg:py-2 mt-auto bottom-0 left-0">
      <div className="flex items-center justify-center mt-4">
        <Image src={"/assets/LOGO.png"} height={40} width={240} alt="logo" />
      </div>
      <hr className="border-gray-600" />
      <div className="flex flex-row items-center justify-center -md:flex-wrap lg:gap-4 -lg:gap-2 [&_a]:text-primary md:[&_a]:text-lg -md:text-sm -sm:text-xs [&_a]:font-semibold  [&_a:hover]:text-primary">
        <div className="group transition duration-300 w-fit  self-center">
          <Link href="/design-your-home">DESIGN YOUR HOME</Link>
          <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary" />
        </div>
        <span className="lg:h-3/4 -lg:h-1/6 w-[1px] bg-gray-400" />
        <div className="group transition duration-300 w-fit  self-center">
          <Link href="/all-products"> SHOP MATERIAL</Link>
          <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary" />
        </div>
        <span className="lg:h-3/4 -lg:h-1/6 w-[1px] bg-gray-400" />
        <div className="group transition duration-300 w-fit  self-center">
          <Link href="https://thikedaar.com/">TURNKEY SOLUTIONS</Link>
          <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary" />
        </div>
        <span className="lg:h-3/4 -lg:h-1/6 w-[1px] bg-gray-400" />
        {/* <span><Link to="/material_product"> MATERIAL PRODUCT</Link></span> */}
        <div className="group transition duration-300 w-fit self-center">
          <Link
            href="/architect/sign_up"
            state={{ onboardingRole: "architect", signUp: true }}
          >
            ARCHITECT ONBOARDING
          </Link>
          <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary" />
        </div>
        <span className="lg:h-3/4 -lg:h-1/6 w-[1px] bg-gray-400" />
        <div className="group transition duration-300 w-fit  self-center">
          <Link
            href="/contractor/sign_up"
            state={{ onboardingRole: "contractor", signUp: true }}
          >
            CONTRACTOR ONBOARDING
          </Link>
          <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary" />
        </div>
        <span className="lg:h-3/4 -lg:h-1/6 w-[1px] bg-gray-400" />
        <div className="group transition duration-300 w-fit  self-center">
          <Link
            href="/dealer/sign_up"
            state={{ onboardingRole: "dealer", signUp: true }}
          >
            DEALER ONBOARDING
          </Link>
          <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary" />
        </div>
      </div>
      <div className="-md:text-sm text-white">
        © 2024 Thikedaar.Com All rights reserved Concept Developed by
        Thikedaar.com.
      </div>
      <hr className="border-gray-600" />
      <div className="flex flex-row items-center justify-center gap-4">
        <Image src={"/ios.svg"} width={135} height={40} alt="ios" />
        <Image src={"/gplay.svg"} width={135} height={40} alt="gplay" />
      </div>
      {/* <i classNameName="fa fa-heart" /> */}
      <SocialIcons />
    </footer>
  );
};

export default Footer;
