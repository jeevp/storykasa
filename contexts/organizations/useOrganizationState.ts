import { useState } from 'react';
import Organization from "@/service/models/Organization";

export default function useOrganizationState() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);

    return {
        organizations,
        setOrganizations
    };
}
