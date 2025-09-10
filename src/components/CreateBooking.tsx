import React from 'react';

type InputChange =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>
  | React.ChangeEvent<HTMLSelectElement>;

const toNumber = (e: InputChange) => {
  const v = (e.target as HTMLInputElement).value;
  return v === '' ? 0 : Number(v);
};

const CreateBooking: React.FC<{ onCreate?: (payload: any) => void }> = ({ onCreate }) => {
  const [title, setTitle] = React.useState('');
  const [date, setDate] = React.useState('');
  const [roomNumber, setRoomNumber] = React.useState<number>(0);
  const [capacity, setCapacity] = React.useState<number>(0);
  const [duration, setDuration] = React.useState<number>(0);
  const [notes, setNotes] = React.useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate?.({
      title,
      date,
      roomNumber,
      capacity,
      duration,
      notes,
    });
  };

  return (
    <form onSubmit={submit} className="create-booking-form">
      <div className="form-row">
        <label htmlFor="title">Title</label>
        <input id="title" value={title} onChange={(e: InputChange) => setTitle(e.target.value)} required />
      </div>

      <div className="form-row">
        <label htmlFor="date">Date</label>
        <input id="date" type="date" value={date} onChange={(e: InputChange) => setDate(e.target.value)} required />
      </div>

      <div className="form-row">
        <label htmlFor="roomNumber">Room Number</label>
        <input
          id="roomNumber"
          type="number"
          inputMode="numeric"
          value={roomNumber}
          onChange={(e: InputChange) => setRoomNumber(toNumber(e))}
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="capacity">Capacity</label>
        <input
          id="capacity"
          type="number"
          inputMode="numeric"
          value={capacity}
          onChange={(e: InputChange) => setCapacity(toNumber(e))}
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="duration">Duration (mins)</label>
        <input
          id="duration"
          type="number"
          inputMode="numeric"
          value={duration}
          onChange={(e: InputChange) => setDuration(toNumber(e))}
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="notes">Notes</label>
        <textarea id="notes" value={notes} onChange={(e: InputChange) => setNotes(e.target.value)} />
      </div>

      <button type="submit" className="btn-primary">Create Booking</button>
    </form>
  );
};

export default CreateBooking;
