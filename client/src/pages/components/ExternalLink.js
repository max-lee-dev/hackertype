import React from "react";
import { Link } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";

const ExternalLink = ({ isExternal, icon, href, src, ...rest }) => (
  <Link
    fontSize="xs"
    fontFamily="heading"
    color="brand.black"
    my={1}
    href={href}
    isExternal={isExternal}
    {...rest}>
    <Image _activeLink={"/"} boxSize={"60px"} src={src} alt="logo" className="site-title" />
  </Link>
);

export default ExternalLink;
