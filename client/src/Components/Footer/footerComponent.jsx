export default function FooterComponent() {
    return (
        <div style={{ backgroundColor: "rgb(23,35,55)", color: "white" }}>
            <footer className="py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-between">
                        <div className="w-full md:w-1/4 mb-6 md:mb-0">
                            <img
                                alt="Company Logo"
                                className="mb-4"
                                height={50}
                                src="https://storage.googleapis.com/a1aa/image/vXvZzWPQFA7KJJAp6Oo8iDs1GChrUgfflTvYplkKf5zJXMsnA.jpg"
                                width={50}
                            />
                            <p className="mb-4">
                                Making the world a better place through constructing elegant
                                hierarchies.
                            </p>
                            <div className="flex space-x-4">
                                <a className="text-gray-300 hover:text-gray-400" href="#">
                                    <i className="fab fa-facebook"></i>
                                </a>
                                <a className="text-gray-300 hover:text-gray-400" href="#">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a className="text-gray-300 hover:text-gray-400" href="#">
                                    <i className="fab fa-xing"></i>
                                </a>
                                <a className="text-gray-300 hover:text-gray-400" href="#">
                                    <i className="fab fa-github"></i>
                                </a>
                                <a className="text-gray-300 hover:text-gray-400" href="#">
                                    <i className="fab fa-youtube"></i>
                                </a>
                            </div>
                        </div>
                        <div className="w-full md:w-1/5 mb-6 md:mb-0">
                            <h3 className="text-white font-bold mb-4">Solutions</h3>
                            <ul>
                                <li className="mb-2">
                                    <a className="hover:underline" href="#">
                                        Marketing
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a className="hover:underline" href="#">
                                        Analytics
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a className="hover:underline" href="#">
                                        Automation
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a className="hover:underline" href="#">
                                        Commerce
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a className="hover:underline" href="#">
                                        Insights
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="w-full md:w-1/5 mb-6 md:mb-0">
                            <h3 className="text-white font-bold mb-4">Support</h3>
                            <ul>
                                <li className="mb-2">
                                    <a className="hover:underline" href="#">
                                        Submit ticket
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a className="hover:underline" href="#">
                                        Documentation
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a className="hover:underline" href="#">
                                        Guides
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="w-full md:w-1/5 mb-6 md:mb-0">
                            <h3 className="text-white font-bold mb-4">Company</h3>
                            <ul>
                                <li className="mb-2">
                                    <a className="hover:underline" href="#">
                                        About
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a className="hover:underline" href="#">
                                        Blog
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a className="hover:underline" href="#">
                                        Jobs
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a className="hover:underline" href="#">
                                        Press
                                    </a>
                                </li>
                            </ul>
                        </div>
                 
                    </div>
                    <div className="mt-8 border-t border-gray-700 pt-4 text-center">
                        <p>© 2024 Your Company, Inc. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
