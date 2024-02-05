import React from 'react';
import STKRadio from "@/components/STKRadio/STKRadio";
import {green300, green600} from "@/assets/colorPallet/colors";

type Plan = {
    name: string;
    price: string;
    features: string[];
    isSelected: boolean;
    extensionName: string;
};

type PlanCardProps = {
    plan: Plan;
    onSelect: () => void;
};

const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelect }) => {
    const { name, price, features, isSelected, extensionName } = plan;

    return (
        <div
            className={`max-w-sm w-full rounded-2xl overflow-hidden border-solid border m-2 transition duration-300 ease-in-out transform bg-white hover:scale-105 cursor-pointer ${isSelected ? `ring-2 ring-green-500 ring-offset-2 border-neutral-800` : 'border-neutral-300'}`}
            onClick={onSelect}
        >
            <div className="px-6 py-4 flex items-center">
                <STKRadio
                    checked={isSelected}
                    onChange={onSelect}
                    value={name}
                    name="plan-selection"
                    color="primary"
                    className="mr-3"
                />
                <div>
                    <div className="flex items-center">
                        <div className="font-bold text-xl now">{name}</div>
                        {extensionName ? (
                            <label className={`ml-2 bg-[#eaf8b2] rounded-2xl px-2 text-sm py-1 font-semibold`}>{extensionName}</label>
                        ) : null}
                    </div>
                    <p className={`text-[${green600}] font-semibold text-lg`}>{price} <span className="font-semibold text-sm">/month</span></p>
                </div>
            </div>
            <ul className="px-6">
                {plan.features.map((feature, index) => (
                    <li key={index} className="list-none my-2 p-4 rounded-2xl bg-neutral-100">
                        <label>{feature}</label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlanCard;
