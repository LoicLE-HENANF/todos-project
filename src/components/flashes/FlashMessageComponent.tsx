import { useEffect } from 'react';
import { useFlashes } from "../providers/FlashesProvider.tsx";

const FlashMessageComponent = () => {
    const { flashMessage, clearFlashMessage } = useFlashes();

    useEffect(() => {
        if (flashMessage) {
            // Clear flash message after 10 seconds
            const timeout = setTimeout(() => {
                clearFlashMessage();
            }, 10000);

            return () => clearTimeout(timeout);
        }
    }, [flashMessage, clearFlashMessage]);

    return (
        <div>
            {flashMessage && (
                <div className={`font-bold ${flashMessage.type === 'error' ? 'text-red-700' : flashMessage.type === 'success' ? 'text-green-700' : 'text-yellow-700'}`}>
                    {flashMessage.message}
                </div>
            )}
        </div>
    );
};

export default FlashMessageComponent;
