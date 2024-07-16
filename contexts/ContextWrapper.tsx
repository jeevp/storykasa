import React from "react";
import "../app/styles/globals.css";
import {AuthProvider} from "@/contexts/auth/AuthContext";
import {ProfileProvider} from "@/contexts/profile/ProfileContext";
import {StoryProvider} from "@/contexts/story/StoryContext";
import {SnackbarProvider} from "@/contexts/snackbar/SnackbarContext";
import {ToolsProvider} from "@/contexts/tools/ToolsContext";
import {AdminProvider} from "@/contexts/admin/useAdmin";
import {LibraryProvider} from "@/contexts/library/LibraryContext";
import {SubscriptionProvider} from "@/contexts/subscription/SubscriptionContext"
import { BlogProvider } from "@/contexts/blog/BlogContext"
import { PromoCodeProvider } from "./promoCode/PromoCodeContext";
import { AnalyticsProvider } from "@/contexts/analytics/AnalyticsContext";
import { OrganizationProvider } from "@/contexts/organizations/OrganizationContext"

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
                                   <SubscriptionProvider>
                                       <BlogProvider>
                                            <PromoCodeProvider>
                                                <AnalyticsProvider>
                                                    <OrganizationProvider>
                                                        {children}
                                                    </OrganizationProvider>
                                                </AnalyticsProvider>
                                            </PromoCodeProvider>
                                       </BlogProvider>
                                   </SubscriptionProvider>
                               </AdminProvider>
                           </ToolsProvider>
                       </SnackbarProvider>
                   </StoryProvider>
               </LibraryProvider>
           </ProfileProvider>
       </AuthProvider>
    )
}
