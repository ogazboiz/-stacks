import {
    AppConfig,
    showConnect,
    type UserData,
    UserSession,
  } from "@stacks/connect";
  import { useEffect, useState } from "react";
  
  // This is like a KEY that lets us talk to wallets!
  export function useStacks() {
    // userData stores info about the connected wallet
    // null means no wallet is connected yet
    const [userData, setUserData] = useState<UserData | null>(null);
  
    // Create app config - this lets us save login info
    // in the browser's memory (localStorage)
    const appConfig = new AppConfig(["store_write"]);
  
    // Create a session for the user
    const userSession = new UserSession({ appConfig });
  
    // FUNCTION 1: Connect the wallet
    function connectWallet() {
      showConnect({
        appDetails: {
          name: "Stacks Account History",
          icon: "https://cryptologos.cc/logos/stacks-stx-logo.png",
        },
        onFinish: () => {
          // When connection succeeds, reload the page
          // This makes sure everything updates properly
          window.location.reload();
        },
        userSession,
      });
    }
  
    // FUNCTION 2: Disconnect the wallet
    function disconnectWallet() {
      userSession.signUserOut();  // Log them out
      setUserData(null);          // Clear the data
    }
  
    // WHEN THE PAGE LOADS: Check if user is already logged in
    useEffect(() => {
      if (userSession.isUserSignedIn()) {
        // User is already signed in! Load their data
        setUserData(userSession.loadUserData());
      } else if (userSession.isSignInPending()) {
        // User is in the middle of signing in, finish it
        userSession.handlePendingSignIn().then((userData) => {
          setUserData(userData);
        });
      }
    }, []);
  
    // Return everything other components need
    return { userData, connectWallet, disconnectWallet };
  }