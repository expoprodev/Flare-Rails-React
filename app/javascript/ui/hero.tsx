import React from "react";
import { Paper, Grid, Box, Typography } from "@material-ui/core";
import { Button, Heading } from "@chakra-ui/react";
import { Navigate, useNavigate } from "react-router-dom";

interface Props {
  title: string;
  subtitle: string;
  button?: { text: string; url: string };
  icon?: React.ReactChild;
}

function Hero({ title, subtitle, button, icon }: Props) {
  const navigate = useNavigate();
  return (
    <Grid container alignContent="center" justify="center">
      <Box my={20} display="flex" flexDirection="column" alignItems="center">
        {icon && icon}
        <Box textAlign="center" mb={4}>
          <Heading size="md" my={4}>
            {title}
          </Heading>
          <Heading size="xs">{subtitle}</Heading>
        </Box>
        {button && (
          <Button colorScheme="purple" onClick={() => navigate(button.url)}>
            {button.text}
          </Button>
        )}
      </Box>
    </Grid>
  );
}

export default Hero;
