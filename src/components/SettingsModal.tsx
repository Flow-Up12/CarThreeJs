import React from 'react';
import { useGameContext } from '../context/GameContextProvider';

const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { inputType, setInputType } = useGameContext();

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="relative bg-white rounded-lg shadow-2xl p-8 z-10 max-w-3xl w-full">
                <div className="flex justify-between items-center mb-1 -mt-4">
                    <h1 className="text-3xl text-black font-bold">Game Settings</h1>
                    <button
                        onClick={onClose}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out"
                    >
                        Close
                    </button>

                </div>
                {/* black hr tag */}
                <hr className="border-gray-700 border-1 mb-4 w-full" />
                {/* grid */}
                <div className="grid grid-cols-12 gap-4 py-12">
                    <div className="col-span-6">
                        <label htmlFor="inputType" className="block text-sm font-medium text-gray-700 mb-2 text-start">
                            Input Type
                        </label>
                        <select
                            id="inputType"
                            value={inputType}
                            onChange={(e) => setInputType(e.target.value as "keyboard" | "controller")}
                            className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value="keyboard">Keyboard</option>
                            <option value="controller">Controller</option>
                        </select>
                    </div>
                    {/* Additional settings inputs can be added here */}
                </div>
                <div className="mt-6 flex justify-end">

                </div>
            </div>
        </div>
    );
};

export default SettingsModal;