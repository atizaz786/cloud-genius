"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("3fede2c8-90f9-451b-9a8f-bde4aaa47cb3");
  }, []);

  return null;
};