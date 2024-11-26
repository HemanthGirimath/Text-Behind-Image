import { useState } from 'react'
import { Input } from "@/components/UI/input"

interface TextInputProps {
  onTextChange: (text: string) => void;
}

export function TextInput({ onTextChange }: TextInputProps) {
  const [text, setText] = useState('')

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value
    setText(newText)
    onTextChange(newText)
  }

  return (
    <Input
      type="text"
      placeholder="Enter text to display behind the image"
      value={text}
      onChange={handleTextChange}
    />
  )
}

