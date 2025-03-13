import React from "react";
import { Box, Skeleton } from "@chakra-ui/react";

const ProductoSkeleton = () => {
  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
      <Skeleton height="200px" mb={4} />
      <Skeleton height="20px" mb={2} />
      <Skeleton height="20px" mb={2} />
      <Skeleton height="20px" mb={2} />
      <Skeleton height="40px" />
    </Box>
  );
};

export default ProductoSkeleton;