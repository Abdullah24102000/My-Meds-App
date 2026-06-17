'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import styles from './page.module.css';

export default function Home() {
  const [meds, setMeds] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState('عبدالله');
  const users = ['عبدالله', 'سارة', 'كريم'];

  // --- كود الحساب المظبوط ---
  const startDate = new Date('2026-06-14');
  const today = new Date();
  const diffTime = today.getTime() - startDate.getTime();
  const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  // -------------------------

  const fetchMeds = async () => {
    const { data } = await supabase
      .from('medications')
      .select('*')
      .order('id', { ascending: true });
    
    if (data) setMeds(data);
  };

  const toggleMed = async (id: number, currentStatus: boolean) => {
    const audio = new Audio('/ding-check.mp3');
    audio.play().catch(e => console.log("الصوت:", e));

    const { error } = await supabase
      .from('medications')
      .update({ 
        status: !currentStatus, 
        taken_by: !currentStatus ? selectedUser : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (!error) {
      fetchMeds();
    }
  };

  useEffect(() => {
    fetchMeds();
  }, []);

  return (
    <div className={styles.mainContainer}>
      <h2 className={styles.title}>جدول أدوية ماما</h2>
      
      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>اختر اسمك:</label>
      <select 
        className={styles.userSelect} 
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        {users.map(user => <option key={user} value={user}>{user}</option>)}
      </select>

      {meds.map((med) => (
        <div 
          key={med.id} 
          className={styles.medCard} 
          style={{ 
            backgroundColor: med.status ? '#d1e7dd' : '#fff',
            borderRight: med.status ? '4px solid #198754' : '4px solid #007bff'
          }}
        >
          <div>
            <div className={styles.medName}>{med.name}</div>
            <div style={{ color: '#555', fontSize: '14px' }}>{med.slot}</div>
            {med.status && (
              <div style={{ fontSize: '12px', marginTop: '5px', color: '#000' }}>
                ✅ تم الأخذ بواسطة: <strong>{med.taken_by}</strong>
              </div>
            )}
          </div>
          
          <input 
            type="checkbox" 
            className={styles.checkbox}
            checked={med.status} 
            onChange={() => toggleMed(med.id, med.status)}
          />
        </div>
      ))}

      <footer className={styles.footer}>
        <div className={styles.statsGrid}>
          {users.map(user => {
            const userTakenCount = meds.filter(m => m.taken_by === user && m.status).length;
            return (
              <div key={user} className={styles.statCard}>
                <div style={{ fontSize: '12px', color: '#666' }}>{user}</div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{userTakenCount}</div>
              </div>
            );
          })}
        </div>
        <div className={styles.footerInfo}>
          متابعين علاج ماما بكل حب ❤️ | اليوم رقم {diffDays}
        </div>
      </footer>
    </div>
  );
}