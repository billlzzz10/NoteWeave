import React, { useState, useEffect } from 'react';
import { commandService } from 'NoteWeave-Engine/src/services/command.service';
import { ChatCommand } from 'NoteWeave-Engine/src/types';

const ChatCommandSettings: React.FC = () => {
  const [commands, setCommands] = useState<ChatCommand[]>([]);
  const [newCommandName, setNewCommandName] = useState<string>('');
  const [newCommandDescription, setNewCommandDescription] = useState<string>('');
  const [newCommandExamples, setNewCommandExamples] = useState<string>('');

  useEffect(() => {
    loadCommands();
  }, []);

  const loadCommands = () => {
    setCommands(commandService.getAllCommands());
  };

  const handleAddCommand = () => {
    if (newCommandName && newCommandDescription) {
      // For simplicity, handler is a mock function here. In a real scenario,
      // you'd need a way to define or load actual command handlers.
      const mockHandler = async (args: string) => {
        console.log(`Executing command: ${newCommandName} with args: ${args}`);
        return `Command '${newCommandName}' executed with args: ${args}`;
      };

      commandService.registerCommand({
        name: newCommandName,
        description: newCommandDescription,
        examples: newCommandExamples.split(',').map(e => e.trim()).filter(e => e !== ''),
        handler: mockHandler,
      });
      loadCommands();
      setNewCommandName('');
      setNewCommandDescription('');
      setNewCommandExamples('');
      alert('Command added successfully! (Note: Handler is a mock)');
    } else {
      alert('Command name and description are required.');
    }
  };

  const handleRemoveCommand = (commandName: string) => {
    commandService.unregisterCommand(commandName);
    loadCommands();
    alert(`Command '${commandName}' removed.`);
  };

  return (
    <div className="chat-command-settings">
      <h2>Chat Command Settings</h2>

      <div className="setting-section">
        <h3>Registered Commands</h3>
        {commands.length === 0 ? (
          <p>No commands registered yet.</p>
        ) : (
          <ul>
            {commands.map((cmd) => (
              <li key={cmd.name}>
                <strong>/{cmd.name}</strong>: {cmd.description}
                {cmd.examples.length > 0 && (
                  <p>Examples: {cmd.examples.join(', ')}</p>
                )}
                <button onClick={() => handleRemoveCommand(cmd.name)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="setting-section">
        <h3>Add New Command</h3>
        <label>
          Command Name (e.g., "ask"): /
          <input
            type="text"
            value={newCommandName}
            onChange={(e) => setNewCommandName(e.target.value)}
            placeholder="e.g., ask"
          />
        </label>
        <label>
          Description:
          <textarea
            value={newCommandDescription}
            onChange={(e) => setNewCommandDescription(e.target.value)}
            placeholder="Describe what this command does"
          />
        </label>
        <label>
          Examples (comma-separated):
          <input
            type="text"
            value={newCommandExamples}
            onChange={(e) => setNewCommandExamples(e.target.value)}
            placeholder="e.g., /ask 'What is RAG?', /ask 'summarize this document'"
          />
        </label>
        <button onClick={handleAddCommand}>Add Command</button>
      </div>
    </div>
  );
};

export default ChatCommandSettings;