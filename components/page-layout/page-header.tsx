import React, { useState } from "react";
import {
  createStyles,
  Header,
  Container,
  Title,
  Indicator,
  Button,
} from "@mantine/core";
import HelpModal from "../help-modal";

const HEADER_HEIGHT = 70;

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 1,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },
}));

export function PageHeader() {
  const { classes } = useStyles();

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  return (
    <Header height={HEADER_HEIGHT} mb={120} className={classes.root}>
      <HelpModal isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} />
      <Container size="sm" className={classes.header}>
        <Indicator inline label="v1" size={16}>
          <Title order={3}>Typechron</Title>
        </Indicator>

        <Button
          variant="subtle"
          color="gray"
          onClick={() => setIsOpenModal(true)}
        >
          Help
        </Button>
      </Container>
    </Header>
  );
}
