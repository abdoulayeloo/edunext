"use client";
import React, {  } from "react";
import { Button } from "@/components/ui/button";
import { logout } from "@/actions/auth/logout";



function page() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Button
        variant={"default"}
        size={"lg"}
        type="submit"
        className="cursor-pointer"
        onClick={() => logout()}
      >
        CLick Me!
      </Button>
    </div>
  );
}

export default page;
