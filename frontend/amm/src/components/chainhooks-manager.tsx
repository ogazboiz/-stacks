"use client";

import { useChainhooks } from "@/hooks/use-chainhooks";
import { useEffect, useState } from "react";
import type { ChainhookDefinition } from "@hirosystems/chainhooks-client";

export function ChainhooksManager() {
  const {
    chainhooks,
    loading,
    error,
    isAvailable,
    loadChainhooks,
    registerChainhook,
    toggleChainhook,
    deleteChainhook,
  } = useChainhooks();

  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [formData, setFormData] = useState<Partial<ChainhookDefinition>>({
    name: "",
    chain: "stacks",
    network: "testnet",
  });

  useEffect(() => {
    if (isAvailable) {
      loadChainhooks();
    }
  }, [isAvailable]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.chain || !formData.network) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await registerChainhook(formData as ChainhookDefinition);
      setShowRegisterForm(false);
      setFormData({ name: "", chain: "stacks", network: "testnet" });
      alert("Chainhook registered successfully!");
    } catch (err) {
      alert("Failed to register chainhook: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleToggle = async (uuid: string, enabled: boolean) => {
    try {
      await toggleChainhook(uuid, !enabled);
    } catch (err) {
      alert("Failed to toggle chainhook: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleDelete = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this chainhook?")) return;
    try {
      await deleteChainhook(uuid);
    } catch (err) {
      alert("Failed to delete chainhook: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  if (!isAvailable) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          Chainhooks API is not available. {error && `Error: ${error}`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Chainhooks Manager</h2>
        <button
          onClick={() => setShowRegisterForm(!showRegisterForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showRegisterForm ? "Cancel" : "Register New Chainhook"}
        </button>
      </div>

      {showRegisterForm && (
        <form onSubmit={handleRegister} className="p-4 bg-gray-50 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Chain</label>
            <select
              value={formData.chain}
              onChange={(e) => setFormData({ ...formData, chain: e.target.value as "stacks" })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="stacks">Stacks</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Network</label>
            <select
              value={formData.network}
              onChange={(e) => setFormData({ ...formData, network: e.target.value as "mainnet" | "testnet" })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="testnet">Testnet</option>
              <option value="mainnet">Mainnet</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Chainhook"}
          </button>
        </form>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      {loading && chainhooks.length === 0 ? (
        <p>Loading chainhooks...</p>
      ) : chainhooks.length === 0 ? (
        <p className="text-gray-500">No chainhooks registered yet.</p>
      ) : (
        <div className="space-y-2">
          {chainhooks.map((hook) => (
            <div
              key={hook.uuid}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{hook.definition.name}</h3>
                <p className="text-sm text-gray-600">
                  {hook.definition.chain} - {hook.definition.network}
                </p>
                <p className="text-xs text-gray-500">UUID: {hook.uuid}</p>
                <p className="text-xs text-gray-500">
                  Status: {hook.status} | Enabled: {hook.enabled ? "Yes" : "No"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggle(hook.uuid, hook.enabled)}
                  className={`px-3 py-1 rounded ${
                    hook.enabled
                      ? "bg-yellow-500 text-white hover:bg-yellow-600"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                  disabled={loading}
                >
                  {hook.enabled ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => handleDelete(hook.uuid)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

