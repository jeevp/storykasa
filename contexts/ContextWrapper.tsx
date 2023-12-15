import React from "react";
import "../app/styles/globals.css";
import {AuthProvider} from "@/contexts/auth/AuthContext";
import {ProfileProvider} from "@/contexts/profile/ProfileContext";
import {StoryProvider} from "@/contexts/story/StoryContext";
import {SnackbarProvider} from "@/contexts/snackbar/SnackbarContext";
import {ToolsProvider} from "@/contexts/tools/ToolsContext";
import {AdminProvider} from "@/contexts/admin/useAdmin";
import {LibraryProvider} from "@/contexts/library/LibraryContext";

interface ContextWrapperProps {
    children: React.ReactNode;
}
export default function ContextWrapper({ children }: ContextWrapperProps){
    return (
       <AuthProvider>
           <ProfileProvider>
               <LibraryProvider>
                   <StoryProvider>
                       <SnackbarProvider>
                           <ToolsProvider>
                               <AdminProvider>
                                   {children}
                               </AdminProvider>
                           </ToolsProvider>
                       </SnackbarProvider>
                   </StoryProvider>
               </LibraryProvider>
           </ProfileProvider>
       </AuthProvider>
    )
}
