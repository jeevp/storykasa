import Image from "next/image";
import bowser from "bowser";
import axios from "axios";
import { useState } from "react";
import STKTextField from "@/components/STKTextField/STKTextField";
import STKButton from "@/components/STKButton/STKButton";
import { Divider } from "@mui/material";
import Link from "next/link";
import STKCard from "@/components/STKCard/STKCard";
import AuthHandler from "@/handlers/AuthHandler";
import Validator from "@/utils/Validator";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useProfile } from "@/contexts/profile/ProfileContext";
import STkCheckbox from "@/components/STKCheckbox/STKCheckbox";
import { green600 } from "@/assets/colorPallet/colors";
import { useAuth } from "@/contexts/auth/AuthContext";
import VideoDialog from "../VideoDialog/VideoDialog";

const supabase = createClientComponentClient<Database>();

interface SignupFormProps {
  onSuccess?: () => void;
}

export default function SignupForm({ onSuccess = () => ({}) }: SignupFormProps) {
  // States
  const [processingAccountCreation, setProcessingAccountCreation] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [termsOfServiceAndPrivacyChecked, setTermsOfServiceAndPrivacyChecked] =
    useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);

  // Contexts
  const { setCurrentProfileId, setCurrentProfile } = useProfile();

  const { setShowHeardAboutDialog } = useAuth();

  // Methods
  const handleSignInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `https://app.storykasa.com/process/oauth`,
      },
    });
  };

  const handleSignUpFormOnChange = (key: string, value: string) => {
    switch (key) {
      case "email":
        setEmail(value);
        setEmailError("");
        break;
      case "password":
        setPassword(value);
        setPasswordError("");
        break;
      case "fullName":
        setFullName(value);
        setFullNameError("");
        break;
      default:
        break;
    }
  };

  const validateSignUpFormFields = () => {
    const errors = [];
    if (!email) {
      setEmailError("Please enter an email for your account");
      errors.push("email");
    } else {
      if (!Validator.isEmailValid(email)) {
        setEmailError("Please provide a valid email address");
        errors.push("email");
      }
    }

    if (!password) {
      setPasswordError("Please enter a password for your account");
      errors.push("password");
    } else {
      if (!Validator.isPasswordValid(password)) {
        setPasswordError(
          "Password must contain at least one number, one uppercase letter, one lowercase letter, and at least 8 or more characters"
        );
        errors.push("password");
      }
    }

    if (!fullName) {
      setFullNameError("Please enter a name for your account");
      errors.push("fullName");
    } else {
      if (!Validator.isFullNameValid(fullName)) {
        setFullNameError("Full name should contain at least first name and last name");
        errors.push("fullName");
      }
    }

    return errors.length === 0;
  };

  const handleSignUp = async () => {
    try {
      if (!validateSignUpFormFields()) return;

      setProcessingAccountCreation(true);

      const browserInfo = bowser.getParser(window.navigator.userAgent);

      const account = await AuthHandler.signUp({
        email,
        password,
        fullName,
        termsAgreed: termsOfServiceAndPrivacyChecked,
        browserName: browserInfo.getBrowserName(),
        browserVersion: browserInfo.getBrowserVersion(),
      });

      setCurrentProfileId(account?.profile?.profileId);
      setCurrentProfile(account?.profile);
      setShowHeardAboutDialog(true);

      onSuccess();
    } catch (error) {
      // @ts-ignore
      setErrorMsg(error?.response?.data?.message || "");
      setProcessingAccountCreation(false);
    }
  };


  return (
    <STKCard>
      <form onSubmit={handleSignUp} className="p-6">
        <div className="flex flex-col">
          <label className="font-semibold">Account name</label>
          <div className="mt-4">
            <STKTextField
              fluid
              placeholder="Enter full name or organization name"
              value={fullName}
              error={Boolean(fullNameError)}
              helperText={fullNameError}
              onChange={(value: string) => handleSignUpFormOnChange("fullName", value)}
            />
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <label className="font-semibold">Email address</label>
          <div className="mt-4">
            <STKTextField
              fluid
              placeholder="Enter a valid email address"
              value={email}
              error={Boolean(emailError)}
              helperText={emailError}
              onChange={(value: string) => handleSignUpFormOnChange("email", value)}
            />
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <label className="font-semibold">Password</label>
          <div className="mt-4">
            <STKTextField
              fluid
              placeholder="Enter a password"
              value={password}
              type="password"
              error={Boolean(passwordError)}
              helperText={passwordError}
              onChange={(value: string) => handleSignUpFormOnChange("password", value)}
            />
          </div>
        </div>

        <div className="flex items-center mt-4">
          <STkCheckbox
            checked={termsOfServiceAndPrivacyChecked}
            onChange={() =>
              setTermsOfServiceAndPrivacyChecked(!termsOfServiceAndPrivacyChecked)
            }
          />
          <label>
            I have read and agree to the{" "}
            <Link
              style={{ color: green600 }}
              href="/terms-of-service-and-privacy"
              target="_blank"
            >
              Terms of Service and Privacy Policy
            </Link>
          </label>
        </div>

        <div className={`mt-8 ${!termsOfServiceAndPrivacyChecked ? "disabled" : ""}`}>
          <STKButton fullWidth loading={processingAccountCreation} onClick={handleSignUp}>
            Create account
          </STKButton>
        </div>

        <div style={{ marginTop: "20px", justifyContent:"center", display:"flex" }}>
          <STKButton variant="text" color="info" onClick={() => setShowVideoDialog(true)}>
            Need help creating your account?
          </STKButton>
        </div>

        <div className="flex justify-center">
          {errorMsg && <label className="text-red-800">{errorMsg}</label>}
        </div>
        <div className="py-6">
          <Divider />
        </div>
        <div className="flex flex-col items-center">
          <div>
            <STKButton
              variant="outlined"
              fullWidth
              startIcon={
                <Image src="/google.svg" width={24} height={24} alt="Google logo" />
              }
              onClick={handleSignInWithGoogle}
            >
              Sign up with Google
            </STKButton>
          </div>
          <div className="mt-4">
            <Link href="/login" className="text-neutral-800">
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </form>
      <VideoDialog active={showVideoDialog} onClose={() => setShowVideoDialog(false)} />
    </STKCard>
  );
}
