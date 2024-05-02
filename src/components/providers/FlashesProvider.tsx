import React, { createContext, useContext, useEffect, useState } from 'react';

interface FlashMessage {
    message: string;
    type: 'success' | 'error' | 'warning';
}

interface FlashedContextType {
    flashMessage: FlashMessage | null;
    setFlashMessage: React.Dispatch<React.SetStateAction<FlashMessage | null>>;
    clearFlashMessage: () => void;
}

const FlashedContext = createContext<FlashedContextType | undefined>(undefined);

export const useFlashes = () => {
    const context = useContext(FlashedContext);
    if (!context) {
        throw new Error('useFlashed must be used within a FlashedProvider');
    }
    return context;
};

interface FlashedProviderProps {
    children: React.ReactNode;
}

const FlashesProvider: React.FC<FlashedProviderProps> = ({ children }) => {
    const [flashMessage, setFlashMessage] = useState<FlashMessage | null>(() => {
        const storedFlashMessage = localStorage.getItem('flashMessage');
        return storedFlashMessage ? JSON.parse(storedFlashMessage) : null;
    });

    useEffect(() => {
        if (flashMessage) {
            localStorage.setItem('flashMessage', JSON.stringify(flashMessage));
        } else {
            localStorage.removeItem('flashMessage');
        }
    }, [flashMessage]);

    const clearFlashMessage = () => {
        setFlashMessage(null);
    };

    const flashedContextValue: FlashedContextType = {
        flashMessage,
        setFlashMessage,
        clearFlashMessage,
    };

    return (
        <FlashedContext.Provider value={flashedContextValue}>
            {children}
        </FlashedContext.Provider>
    );
};

export default FlashesProvider;
