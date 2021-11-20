import React from 'react'


export const ErrorNotAvailable: React.FC<{mediaType: string}> = ({ mediaType }) => {
        return (
            <div>
                This {mediaType === 'movie' ? 'Movie' : 'Show'} is not available to stream in any country :(
            </div>
        );
}