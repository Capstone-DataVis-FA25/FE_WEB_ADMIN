import { useState, useEffect } from "react";
import { useModal } from "../hooks/useModal";
import { useDebounce } from "../hooks/useDebounce";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useToggle } from "../hooks/useToggle";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { Modal } from "./ui/modal";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export default function HookDemo() {
  // useModal hook
  const modal = useModal();

  // useDebounce hook
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // useLocalStorage hook
  const [username, setUsername] = useLocalStorage("username", "");

  // useToggle hook
  const [isToggled, toggleActions] = useToggle(false);

  // useMediaQuery hook
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Effect to demonstrate debounced search
  useEffect(() => {
    console.log("Debounced search term:", debouncedSearchTerm);
    // In a real app, you would call an API here
  }, [debouncedSearchTerm]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hook Demonstrations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* useModal Demo */}
          <div>
            <h3 className="text-lg font-medium mb-2">useModal Hook</h3>
            <Button onClick={modal.open}>Open Modal</Button>
          </div>

          {/* useDebounce Demo */}
          <div>
            <h3 className="text-lg font-medium mb-2">useDebounce Hook</h3>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type something to see debounce in action..."
            />
            <p className="mt-2 text-sm text-gray-500">
              Current value: {searchTerm}
            </p>
            <p className="text-sm text-gray-500">
              Debounced value: {debouncedSearchTerm}
            </p>
          </div>

          {/* useLocalStorage Demo */}
          <div>
            <h3 className="text-lg font-medium mb-2">useLocalStorage Hook</h3>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
            <p className="mt-2 text-sm text-gray-500">
              Stored value: {username || "Not set"}
            </p>
          </div>

          {/* useToggle Demo */}
          <div>
            <h3 className="text-lg font-medium mb-2">useToggle Hook</h3>
            <div className="flex items-center space-x-4">
              <span>Status: {isToggled ? "ON" : "OFF"}</span>
              <Button onClick={toggleActions.toggle}>Toggle</Button>
              <Button onClick={toggleActions.setTrue} variant="outline">
                Set ON
              </Button>
              <Button onClick={toggleActions.setFalse} variant="outline">
                Set OFF
              </Button>
            </div>
          </div>

          {/* useMediaQuery Demo */}
          <div>
            <h3 className="text-lg font-medium mb-2">useMediaQuery Hook</h3>
            <p>Screen size: {isMobile ? "Mobile" : "Desktop/Tablet"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Modal component */}
      <Modal isOpen={modal.isOpen} onClose={modal.close} title="Demo Modal">
        <div className="space-y-4">
          <p>This is a modal component demonstrating the useModal hook.</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={modal.close}>
              Cancel
            </Button>
            <Button onClick={modal.close}>Confirm</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
