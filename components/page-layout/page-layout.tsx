import React from "react";
import { Container } from "@mantine/core";
import { PageHeader } from "./page-header";

const PageLayout = (props: any) => {
  return (
    <>
      <PageHeader />
      <Container size="sm">{props.children}</Container>
    </>
  );
};

export default PageLayout;
