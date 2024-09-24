//src/components/CopyLink.tsx

import { FC, useState } from 'react';
import { FiCopy, FiExternalLink } from 'react-icons/fi';

interface CopyLinkProps {
    value: string;
    explorerLink: string;
}

const CopyLink: FC<CopyLinkProps> = ({ value, explorerLink }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <input
                type="text"
                value={value}
                readOnly
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
            >
                <FiCopy />
            </button>
            <a href={explorerLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
                <FiExternalLink />
            </a>
            {copied && <span className="ml-2 text-green-500">Copied!</span>}
        </div>
    );
};

export default CopyLink;
