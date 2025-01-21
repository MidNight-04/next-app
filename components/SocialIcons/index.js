import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Link from "next/link";

const index = () => {
  return (
    <div
      className="grid grid-cols-2 xl:gap-4 [&_div]:flex [&_div]:flex-row [&_div]:items-center [&_div]:text-center [&_div]:gap-2 [&_svg]:text-yellow-500 
    [&_svg]:text-3xl [&_p]:text-xl [&_p]:mb-0 [&_p]:text-white -sm:grid-cols-1 -xl:gap-2 -md:[&_svg]:text-xl -md:[&_p]:text-base"
    >
      <Link href="https://www.facebook.com/thikedaardotcom/">
        <div>
          <FacebookIcon />
          <p>Facebook</p>
        </div>
      </Link>
      <Link href="https://www.twitter.com/thikedaardotcom/">
        <div>
          <TwitterIcon />
          <p>Twitter</p>
        </div>
      </Link>
      <Link href="https://youtu.be/UyisZ4PqEi0">
        <div>
          <YouTubeIcon />
          <p>Youtube</p>
        </div>
      </Link>
      <Link href="https://www.linkedin.com/company/thikedaardotcom/">
        <div>
          <LinkedInIcon />
          <p>LinkedIn</p>
        </div>
      </Link>
      <Link href="https://www.instagram.com/thikedaardotcom/">
        <div>
          <InstagramIcon />
          <p>Instagram</p>
        </div>
      </Link>
      <Link href="https://www.pinterest.com/thikedaardotcom/">
        <div>
          <PinterestIcon />
          <p>Pinterest</p>
        </div>
      </Link>
      <Link href="https://api.whatsapp.com/send?phone=7859043737">
        <div>
          <WhatsAppIcon />
          <p>WhatsApp</p>
        </div>
      </Link>
    </div>
  );
};

export default index;
