import React from 'react';
import { Truck, Package, CheckCircle, Clock, MapPin } from 'lucide-react';

const OrderTracking = ({ status }) => {
    const statuses = [
        { key: 'Processing', icon: Clock, label: 'Processing' },
        { key: 'Packing', icon: Package, label: 'Packing' },
        { key: 'Shipped', icon: Truck, label: 'Shipped' },
        { key: 'Out for Delivery', icon: MapPin, label: 'Out for Delivery' },
        { key: 'Delivered', icon: CheckCircle, label: 'Delivered' }
    ];

    const currentIndex = statuses.findIndex(s => s.key === status) !== -1
        ? statuses.findIndex(s => s.key === status)
        : 0;

    return (
        <div className="w-full py-6">
            <div className="relative">
                {/* Progress Bar Background */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>

                {/* Active Progress Bar */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-[var(--color-primary-green)] -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
                    style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
                ></div>

                {/* Steps */}
                <div className="relative z-10 flex justify-between">
                    {statuses.map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = index <= currentIndex;
                        const isCurrent = index === currentIndex;

                        return (
                            <div key={step.key} className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${isCompleted ? 'bg-[var(--color-primary-green)] text-white' : 'bg-gray-200 text-gray-400'} ${isCurrent ? 'ring-4 ring-green-100' : ''}`}>
                                    <Icon size={20} />
                                </div>
                                <span className={`mt-2 text-xs md:text-sm font-bold text-center w-20 hidden md:block ${isCompleted ? 'text-[var(--color-primary-green)]' : 'text-gray-400'}`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-4 md:hidden text-center">
                <span className="text-sm font-bold text-[var(--color-primary-green)]">
                    Current Status: {statuses[currentIndex]?.label}
                </span>
            </div>
        </div>
    );
};

export default OrderTracking;
