import React, { useState } from 'react';
import { useGameContext } from '../context/GameContextProvider';

const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {

    const { inputType, setInputType } = useGameContext();
    const [activeTab, setActiveTab] = useState<'settings' | 'controls'>('settings');

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
                <hr className="border-gray-700 border-1 mb-4 w-full" />
                <div className="flex space-x-4 mb-4">
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-4 py-2 rounded-md focus:outline-none ${activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Settings
                    </button>
                    <button
                        onClick={() => setActiveTab('controls')}
                        className={`px-4 py-2 rounded-md focus:outline-none ${activeTab === 'controls' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Controls
                    </button>
                </div>
                {activeTab === 'settings' && (
                    <div className="grid grid-cols-12 gap-4 py-12">
                        <div className="col-span-6">
                            <label htmlFor="inputType" className="block text-sm font-medium text-gray-700 mb-2 text-start">
                                Input Type
                            </label>
                            <select
                                id="inputType"
                                value={inputType}
                                onChange={(e) => setInputType(e.target.value as 'keyboard' | 'controller')}
                                className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="keyboard">Keyboard</option>
                                <option value="controller">Controller</option>
                            </select>
                        </div>
                        {/* Additional settings inputs can be added here */}
                    </div>
                )}
                {(inputType === 'controller' && activeTab === 'controls') &&
                    <div className='text-black p-1'>
                        <h2 className="text-2xl mb-4  text-left">Controller Controls</h2>
                        <ul className="list-disc ml-5">
                            <li>Left Stick: Move</li>
                            <li>Right Stick: Rotate Camera</li>
                            <li>X Button: Jump</li>
                            <li>R1: Boost</li>
                            <li>L1: Air Control</li>
                        </ul>
                    </div>}

                {(inputType === 'keyboard' && activeTab === 'controls') &&
                    <div className='text-black p-1'>
                        <h2 className="text-2xl mb-4 text-left">Keyboard Controls</h2>
                        <ul className="list-disc ml-5 text-left">
                            <li>W: Move Forward</li>
                            <li>S: Move Backward</li>
                            <li>A: Turn Left</li>
                            <li>D: Turn Right</li>
                            <li>Space: Jump/Boost</li>
                            <li>Double Space: Fly</li>
                            <li>Y: Toggle Camera View</li>
                        </ul>
                    </div>}
            </div>
        </div>
    );
};

export default SettingsModal;