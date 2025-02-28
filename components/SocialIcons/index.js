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
    <div className="flex flex-row gap-4 items-center justify-center">
      <Link href="https://www.facebook.com/thikedaardotcom/">
        <div>
          <FacebookIcon />
          {/* <p>Facebook</p> */}
        </div>
      </Link>
      <Link href="https://www.twitter.com/thikedaardotcom/">
        <div>
          <TwitterIcon />
          {/* <p>Twitter</p> */}
        </div>
      </Link>
      <Link href="https://youtu.be/UyisZ4PqEi0">
        <div>
          <YouTubeIcon />
          {/* <p>Youtube</p> */}
        </div>
      </Link>
      <Link href="https://www.linkedin.com/company/thikedaardotcom/">
        <div>
          <LinkedInIcon />
          {/* <p>LinkedIn</p> */}
        </div>
      </Link>
      <Link href="https://www.instagram.com/thikedaardotcom/">
        <div>
          <InstagramIcon />
          {/* <p>Instagram</p> */}
        </div>
      </Link>
      <Link href="https://www.pinterest.com/thikedaardotcom/">
        <div>
          <PinterestIcon />
          {/* <p>Pinterest</p> */}
        </div>
      </Link>
      <Link href="https://api.whatsapp.com/send?phone=7859043737">
        <div>
          <WhatsAppIcon />
          {/* <p>WhatsApp</p> */}
        </div>
      </Link>
    </div>
  );
};

export default index;
