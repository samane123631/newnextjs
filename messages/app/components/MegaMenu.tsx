"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

const courses = [
  {
    name: "A1 Anfänger",
    teacher: "Frau Azadi",
    time: "Mo - Mi 18:00 - 20:00",
    duration: "8 Wochen",
  },
  {
    name: "A2 Grundstufe",
    teacher: "Frau Azadi",
    time: "Di - Do 18:00 - 20:00",
    duration: "8 Wochen",
  },
  {
    name: "B1 Mittelstufe",
    teacher: "Herr Eftekharzadeh",
    time: "Mo - Mi 18:00 - 20:00",
    duration: "10 Wochen",
  },
  {
    name: "B2 Oberstufe",
    teacher: "Herr Eftekhardeh",
    time: "Di - Do 18:00 - 20:00",
    duration: "10 Wochen",
  },
  {
    name: "C1 Fortgeschritten",
    teacher: "Herr Eftekhardeh",
    time: "Mo - Mi 18:00 - 20:00",
    duration: "12 Wochen",
  },
];

export default function MegaMenu() {
  const t = useTranslations("MegaMenu");

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >

      <button className="font-medium hover:text-blue-700">
        {t("title")}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{opacity:0,y:15}}
            animate={{opacity:1,y:0}}
            exit={{opacity:0,y:15}}
            className="absolute left-0 top-10 w-[850px] rounded-xl bg-white p-8 shadow-2xl"
          >

            <div className="grid grid-cols-3 gap-8">

              <div>
                <h3 className="mb-4 font-bold text-blue-700">
                  {t("courses")}
                </h3>

                {courses.map((course,index)=>(
                  <div
                    key={course.name}
                    onMouseEnter={()=>setActive(index)}
                    className="cursor-pointer py-2 hover:text-blue-700"
                  >
                    {course.name}
                  </div>
                ))}

              </div>


              <div className="col-span-2 rounded-xl bg-gray-50 p-6">

                <h3 className="text-xl font-bold text-blue-700">
                  {courses[active].name}
                </h3>

                <ul className="mt-4 space-y-3">

                  <li>
                    👨‍🏫 {t("teacher")}:
                    {courses[active].teacher}
                  </li>

                  <li>
                    🕒 {t("time")}:
                    {courses[active].time}
                  </li>

                  <li>
                    📅 {t("duration")}:
                    {courses[active].duration}
                  </li>

                  <li>
                    📍 {t("format")}:
                    Online & Präsenz
                  </li>

                </ul>

                <Link
                  href="#"
                  className="mt-5 block rounded-lg bg-blue-700 py-2 text-center text-white"
                >
                  {t("more")}
                </Link>

              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}