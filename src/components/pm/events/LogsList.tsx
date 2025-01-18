import { Log } from "@/types";
import { useState, useRef, useEffect } from "react";
import { DeleteButton } from "../common/delete-button";
import { Edit2 } from "lucide-react";

interface LogsListProps {
  logs: Log[];
  onUpdateLogTitle: (
    logId: string,
    newTitle: string,
    newDuration: number
  ) => void;
  onDeleteLog: (logId: string) => void;
}

export default function LogsList({
  logs,
  onUpdateLogTitle,
  onDeleteLog,
}: LogsListProps) {
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editedLogTitle, setEditedLogTitle] = useState("");
  const [editedLogDuration, setEditedLogDuration] = useState(0);
  const logTitleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingLogId && logTitleInputRef.current) {
      logTitleInputRef.current.focus();
    }
  }, [editingLogId]);

  return (
    <div className="mt-4 space-y-2">
      {logs.map((log) => (
        <div key={log.id} className="flex justify-between items-center text-sm">
          {editingLogId === log.id ? (
            <>
              <input
                ref={logTitleInputRef}
                type="text"
                value={editedLogTitle}
                onChange={(e) => setEditedLogTitle(e.target.value)}
                onBlur={() => {
                  setEditingLogId(null);
                  onUpdateLogTitle(log.id, editedLogTitle, editedLogDuration);
                }}
                className="flex-grow mr-2"
              />
              <input
                type="number"
                value={editedLogDuration}
                onChange={(e) =>
                  setEditedLogDuration(parseFloat(e.target.value))
                }
                onBlur={() => {
                  setEditingLogId(null);
                  onUpdateLogTitle(log.id, editedLogTitle, editedLogDuration);
                }}
                className="w-16 mr-2"
                step="0.25"
              />
            </>
          ) : (
            <>
              <span
                className="flex-grow cursor-pointer"
                onClick={() => {
                  setEditingLogId(log.id);
                  setEditedLogTitle(log.title);
                  setEditedLogDuration(log.duration);
                }}
              >
                {log.title}
                <Edit2 className="w-3 h-3 inline-block ml-2 text-gray-500" />
              </span>
              <span
                className="mx-2 cursor-pointer"
                onClick={() => {
                  setEditingLogId(log.id);
                  setEditedLogTitle(log.title);
                  setEditedLogDuration(log.duration);
                }}
              >
                {log.duration}h
              </span>
            </>
          )}
          <DeleteButton
            variant="ghost"
            title={log.title}
            className="text-red-500 hover:text-red-700"
            onDelete={() => onDeleteLog(log.id)}
          />
        </div>
      ))}
    </div>
  );
}
