import React from 'react';
import STKRadio from "@/components/STKRadio/STKRadio";
import {green600} from "@/assets/colorPallet/colors";

type Plan = {
    name: string;
    price: string;
    features: string[];
    isSelected: boolean;
};

type PlanCardProps = {
    plan: Plan;
    onSelect: () => void;
};

const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelect }) => {
    const { name, price, features, isSelected } = plan;

    return (
        <div
            className={`max-w-sm lg:w-72 w-full rounded overflow-hidden border-solid border m-4 transition duration-300 ease-in-out transform bg-white hover:scale-105 cursor-pointer ${isSelected ? `ring-2 ring-green-500 ring-offset-2 border-neutral-800` : 'border-neutral-300'}`}
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
                    <div className="font-bold text-xl mb-2 now">{name}</div>
                    <p className={`text-[${green600}] font-semibold text-lg`}>{price} <span className="font-semibold text-sm">/month</span></p>
                </div>
            </div>
            <ul className="px-6">
                {plan.features.map((feature, index) => (
                    <li key={index} className="list-none py-2">
                        <label>{feature}</label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlanCard;
