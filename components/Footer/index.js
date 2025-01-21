// import "./index.css";
import Link from "next/link";
import SocialIcons from "../SocialIcons";
import imageUrl from "../../constant/imageUrl";

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
    <div className="flex-column bg-black text-yellow-500 h-auto text-center z-50 justify-between px-16 py-4 -lg:px-4 -lg:py-2 mt-auto bottom-0 left-0">
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col md:gap-4 text-lg font-semibold -md:gap-4 -md:text-base -sm:text-sm">
          <span>Privacy Policy</span>
          <span>Terms Of Use</span>
          <span>Know More</span>
          <span>Contact Us</span>
          <span>Disclaimer</span>
        </div>
        <div>
          <SocialIcons />
        </div>
        <div className="flex flex-column flex-wrap h-full lg:gap-4 -lg:gap-2 [&_a]:text-white md:[&_a]:text-lg -md:text-sm -sm:text-xs [&_a]:font-semibold  [&_a:hover]:text-yellow-500">
          <div className="group transition duration-300 w-fit  self-center">
            <Link href="/design-your-home">DESIGN YOUR HOME</Link>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-yellow-500" />
          </div>
          <div className="group transition duration-300 w-fit  self-center">
            <Link href="/all-products"> SHOP MATERIAL</Link>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-yellow-500" />
          </div>
          <div className="group transition duration-300 w-fit  self-center">
            <Link href="https://thikedaar.com/">TURNKEY SOLUTIONS</Link>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-yellow-500" />
          </div>
          {/* <span><Link to="/material_product"> MATERIAL PRODUCT</Link></span> */}
          <div className="group transition duration-300 w-fit self-center">
            <Link
              href="/architect/sign_up"
              state={{ onboardingRole: "architect", signUp: true }}
            >
              ARCHITECT ONBOARDING
            </Link>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-yellow-500" />
          </div>
          <div className="group transition duration-300 w-fit  self-center">
            <Link
              href="/contractor/sign_up"
              state={{ onboardingRole: "contractor", signUp: true }}
            >
              CONTRACTOR ONBOARDING
            </Link>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-yellow-500" />
          </div>
          <div className="group transition duration-300 w-fit  self-center">
            <Link
              href="/dealer/sign_up"
              state={{ onboardingRole: "dealer", signUp: true }}
            >
              DEALER ONBOARDING
            </Link>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-yellow-500" />
          </div>
        </div>
        {/* <i classNameName="fa fa-heart" /> */}
      </div>
      <div className="font-semibold mt-2 -md:text-sm">
        © 2024 Thikedaar.Com All rights reserved Concept Developed by
        Thikedaar.com.
      </div>
    </div>
  );
};

export default Footer;
