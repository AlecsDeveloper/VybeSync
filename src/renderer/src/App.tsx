import React from "react";
import NavBar from "@components/NavBar";
import MainContent from "@components/MainContent";
import PlayerBar from "@components/PlayerBar";
import { ConfigDialog } from "@renderer/components/Dialogs";

export default function App(): React.JSX.Element {
  return (
    <div className="h-screen w-screen bg-ui-dark-200">
      <NavBar />
      <MainContent />
      <PlayerBar />

      <ConfigDialog />
    </div>
  )
}
