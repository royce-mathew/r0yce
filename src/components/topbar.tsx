import React from 'react';

const Topbar: React.FC = () => {
    return (
        <div className="w-full max-h-8">
            <nav>
                <ul>
                    <li>
                        <a href="/">Home</a>
                    </li>
                    <li>
                        <a href="/projects">Projects</a>
                    </li>
                    <li>
                        <a href="/contact">Contact</a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Topbar;