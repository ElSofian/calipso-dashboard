"use client";

import React, { useState, useEffect, useRef } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { fr } from "date-fns/locale";
import { Notification } from "@/types";

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const [theme, setTheme] = useState("light");
	const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

		const fetchNotifications = async () => {
			const response = await fetch("/api/notifications");
			const data = await response.json();
			const parsed: Notification[] = data.notifications.map((n: Notification) => ({
        ...n,
        date: new Date(n.date),
      }));
			setNotifications(parsed);
		};

		fetchNotifications();

    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.body.classList.toggle("dark", saved === "dark");
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false);
			}
		}
		
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.body.classList.toggle("dark", next === "dark");
  };
  
  const toggleNotifications = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const markAsRead = async (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? {...notif, readed: true} : notif
      )
    );

		try {

			await fetch(`/api/notifications?id=${id}`, {
				method: 'PUT',
				body: JSON.stringify({ id })
			});
		
		} catch (err) {
			console.error('Erreur lors de la mise à jour de la notification:', err);
		}
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, readed: true })));

		try {
			await fetch('/api/notifications', {
				method: 'PUT',
			  body: JSON.stringify({})
			});
		} catch (err) {
			console.error('Erreur lors de la mise à jour de toutes les notifications:', err);
		}
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-white/25 dark:shadow-sm">
      <div className="flex items-center gap-2">
        <button
          className="px-1 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer"
          onClick={onToggleSidebar}
        >
          <i className="fa-light fa-sidebar fa-fw fa-md dark:text-white" />
        </button>
				<div className="bg-neutral-200 rounded-full shrink-0 h-4 w-0.5 mx-2"></div>
        <h1 className="text-lg font-medium dark:text-white">Test</h1>
      </div>
      <div className="flex items-center gap-3">
        <i
          className={`fa-light fa-fw fa-md ${
            theme === "light" ? "fa-moon" : "fa-sun"
          } cursor-pointer dark:text-white`}
          onClick={toggleTheme}
        />
        <div className="relative" ref={dropdownRef}>
          {notifications.filter(n => !n.readed).length > 0 ? (
            <div className="relative">
              <i className="fa-light fa-bell fa-fw fa-md cursor-pointer dark:text-white" onClick={toggleNotifications} />
              <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full" />
            </div>
          ) : (
            <i className="fa-light fa-bell fa-fw fa-md cursor-pointer dark:text-white" onClick={toggleNotifications} />
          )}
          
          {isDropdownOpen && (
            <div className="absolute right-0 z-50 mt-2 w-80 transition-all duration-300 ease-in-out origin-top-right">
              <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg ring-1 ring-[var(--border)] ring-opacity-5 dark:ring-neutral-600 divide-y divide-gray-200 dark:divide-neutral-700">
                <div className="p-3 flex justify-between items-center">
                  <h3 className="text-sm font-medium dark:text-white">Notifications</h3>
                  {notifications.filter(n => !n.readed).length > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-red-900 dark:text-red-100">
                      {notifications.filter(n => !n.readed).length} nouvelle{notifications.filter(n => !n.readed).length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      Aucune notification
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-neutral-700 dark:bg-neutral-800">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-3 hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer ${!notification.readed ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                          onMouseEnter={() => markAsRead(notification.id)}
                        >
                          <div className="flex justify-between">
                            <p className="text-sm text-gray-600 dark:text-white">{notification.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
															{formatDistanceToNowStrict(notification.date, {
                                addSuffix: true,
                                locale: fr,
                              })}
														</p>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div className="p-2 bg-gray-50 dark:bg-neutral-900 text-center">
                    <button className="text-sm text-blue-500 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer" onClick={() => markAllAsRead()}>
                      Tout marquer comme lu
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
