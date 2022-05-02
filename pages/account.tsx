import React, { useEffect, useState } from "react";
import { Box, Loader, Stack, Text, Title } from "@mantine/core";
import { useAuth } from "../ contexts/authUserContext";
import { getAllGamesByUserId } from "../utils/firebase-functions";
import { Game } from "../interfaces/game.interface";
import Link from "next/link";
import GameModal from "../components/modals/game-modal";
import GameRecord from "../components/game-record";

const UserAccount = () => {
  const { authUser, loading } = useAuth();
  const [games, setGames] = useState<Game[]>();
  const [isGameModalOpened, setIsGameModalOpened] = useState<boolean>(false);
  const [gameToDisplay, setGameToDisplay] = useState<Game>();

  const handleContentClick = (game: Game) => {
    setGameToDisplay(game);
    setIsGameModalOpened(true);
  };

  useEffect(() => {
    if (!loading && authUser) {
      const getUserGames = async () => {
        return getAllGamesByUserId(authUser.uid);
      };

      getUserGames()
        .then((data) => {
          setGames(data);
        })
        .catch();
    }
  }, [loading]);

  return (
    <div>
      {gameToDisplay && (
        <GameModal
          game={gameToDisplay}
          isGameModalOpened={isGameModalOpened}
          setIsGameModalOpened={setIsGameModalOpened}
        />
      )}

      {loading && !authUser && <Loader size="sm" />}

      {!loading && !authUser && (
        <>
          <Text component="span" color="red">
            Unauthorized access.
          </Text>
          <Text>
            You do not have the permission to view this page. Please{" "}
            <Link href="/sign-in" passHref>
              <Text component="a" variant="link">
                sign in
              </Text>
            </Link>{" "}
            with your account.
          </Text>
        </>
      )}

      {!loading && authUser && (
        <Box>
          <Title order={2}>My Account</Title>
          <Text size="sm" color="dimmed" mt={4}>
            Hello, {authUser.username}
          </Text>

          <Box mt={30}>
            {games && games.length === 0 && (
              <Text color="dimmed">No available data</Text>
            )}

            {games && games.length !== 0 && (
              <>
                <Stack>
                  {games.map((game: Game, idx: number) => {
                    return (
                      <GameRecord
                        key={idx}
                        index={idx}
                        game={game}
                        handleContentClick={() => handleContentClick(game)}
                        isLeaderboard={false}
                      />
                    );
                  })}
                </Stack>
              </>
            )}
          </Box>
        </Box>
      )}
    </div>
  );
};

export default UserAccount;
