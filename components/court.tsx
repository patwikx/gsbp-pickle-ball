interface CourtProps {
    number: number
    onSelect: () => void
  }
  
  export default function Courtx({ number, onSelect }: CourtProps) {
    return (
      <div
        className="bg-green-500 p-4 rounded-lg text-white text-center cursor-pointer hover:bg-green-600 transition-colors"
        onClick={onSelect}
      >
        <h2 className="text-xl font-bold">Court {number}</h2>
      </div>
    )
  }