const fs = require('fs');

const path = 'c:/Users/evanm/Downloads/Staff App/src/components/AdminPanel.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove the IntersectionObserver useEffect
const observerStart = content.indexOf('  useEffect(() => {\n    const observer = new IntersectionObserver');
if (observerStart !== -1) {
  const observerEnd = content.indexOf('  }, []);\n', observerStart) + '  }, []);\n'.length;
  content = content.substring(0, observerStart) + content.substring(observerEnd);
}

// 2. Change scrollIntoView to setActiveSubTab
const tabs = ['approvals', 'roles', 'staff', 'infractions', 'flights', 'flight_logs', 'loas', 'passwords', 'status', 'audit'];
tabs.forEach(tab => {
  content = content.replaceAll(
    `onClick={() => document.getElementById('section-${tab}')?.scrollIntoView({ behavior: 'smooth' })}`,
    `onClick={() => setActiveSubTab('${tab}')}`
  );
});

// 3. Wrap sections with {activeSubTab === 'tab' && ( ... )}
// The sections are siblings under <div style={styles.mainContent}>
// We can just find `<div id="section-` and add the condition before it, 
// but we need to find the matching closing div.
// It's easier to just use string replacements since we know the exact structure.
const sections = [
  { id: 'approvals', next: '<div id="section-infractions">' },
  { id: 'infractions', next: '<div id="section-roles">' },
  { id: 'roles', next: '<div id="section-staff">' },
  { id: 'staff', next: '<div id="section-flight_logs">' },
  { id: 'flight_logs', next: '<div id="section-flights">' },
  { id: 'flights', next: '<div id="section-loas">' },
  { id: 'loas', next: '<div id="section-passwords">' },
  { id: 'passwords', next: '<div id="section-status">' },
  { id: 'status', next: '<div id="section-audit">' },
  { id: 'audit', next: '      </div>\n    </div>\n  );\n}\n' }
];

sections.forEach((sec) => {
  const startStr = `<div id="section-${sec.id}">`;
  const nextStr = sec.next;
  
  const startIdx = content.indexOf(startStr);
  const nextIdx = content.indexOf(nextStr, startIdx);
  
  if (startIdx !== -1 && nextIdx !== -1) {
    const beforeSection = content.substring(0, startIdx);
    const sectionBody = content.substring(startIdx, nextIdx);
    const afterSection = content.substring(nextIdx);
    
    content = beforeSection + `{activeSubTab === '${sec.id}' && (\n` + sectionBody + `)}\n` + afterSection;
  }
});

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated AdminPanel UI to use separate pages.');
