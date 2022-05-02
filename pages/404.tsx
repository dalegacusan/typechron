import React from "react";
import {
  createStyles,
  Image,
  Title,
  Text,
  Button,
  SimpleGrid,
} from "@mantine/core";
import { useRouter } from "next/router";
import image from "../components/images/not-found.svg";

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 80,
  },

  title: {
    fontWeight: 900,
    fontSize: 24,
    marginBottom: theme.spacing.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan("sm")]: {
      fontSize: 22,
    },
  },

  control: {
    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },

  mobileImage: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  desktopImage: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
}));

const PageNotFound = () => {
  const { classes } = useStyles();
  const router = useRouter();

  return (
    <SimpleGrid
      spacing={80}
      cols={2}
      breakpoints={[{ maxWidth: "sm", cols: 1, spacing: 40 }]}
    >
      <Image
        src={image.src}
        className={classes.mobileImage}
        alt="page not found"
      />
      <div>
        <Title className={classes.title}>Oops! Page Not Found</Title>
        <Text color="dimmed" size="md">
          Page you are trying to open does not exist. You may have mistyped the
          address, or the page has been moved to another URL. If you think this
          is an error, please contact support.
        </Text>
        <Button
          variant="outline"
          size="sm"
          mt="xl"
          color="gray"
          className={classes.control}
          onClick={() => router.push("/")}
        >
          Get back to home page
        </Button>
      </div>
      <Image
        src={image.src}
        className={classes.desktopImage}
        alt="page not found"
      />
    </SimpleGrid>
  );
};

export default PageNotFound;
