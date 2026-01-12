// ===== RSVP =====
fetch('xv-isa-backend-production-36cf.up.railway.app/rsvp')
  .then(res => res.json())
  .then(data => {
    const wrapper = document.getElementById('confirmaciones-wrapper');
    const totalSpan = document.getElementById('total-confirmaciones');
    const confirmaciones = {};

    // Agrupar personas por confirmación
    data.forEach(p => {
      if (!confirmaciones[p.rsvp_id]) confirmaciones[p.rsvp_id] = [];
      confirmaciones[p.rsvp_id].push(p);
    });

    // Total de personas, no de grupos
    const totalPersonas = data.length;
    totalSpan.textContent = totalPersonas;

    // Generar HTML de cada confirmación
    Object.entries(confirmaciones).forEach(([rsvpId, personas]) => {
      const container = document.createElement('div');
      container.className = 'confirmacion';

      const titulo = document.createElement('h3');
      titulo.textContent = `Confirmación #${rsvpId} — ${personas.length} persona(s)`;
      container.appendChild(titulo);

      const table = document.createElement('table');
      const thead = document.createElement('thead');
      thead.innerHTML = `
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Requerimientos</th>
        </tr>
      `;
      table.appendChild(thead);

      const tbody = document.createElement('tbody');
      personas.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${p.nombre}</td>
          <td>${p.apellido}</td>
          <td>${p.requerimientos || ''}</td>
        `;
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);

      container.appendChild(table);
      wrapper.appendChild(container);
    });

    // ===== Buscador: filtrar personas =====
    const buscador = document.getElementById('buscar-confirmacion');
    buscador.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();

      document.querySelectorAll('.confirmacion').forEach(container => {
        const rows = container.querySelectorAll('tbody tr');
        let anyVisible = false;

        rows.forEach(row => {
          const texto = row.innerText.toLowerCase();
          if (texto.includes(term)) {
            row.style.display = '';
            anyVisible = true;
          } else {
            row.style.display = 'none';
          }
        });

        // Si ninguna fila es visible, ocultar todo el bloque
        container.style.display = anyVisible ? '' : 'none';
      });
    });

  })
  .catch(err => console.error('Error al obtener RSVP:', err));



// ===== Canciones =====
fetch('xv-isa-backend-production-36cf.up.railway.app/canciones/__listado_interno_xv_isa_2026')
  .then(res => res.json())
  .then(data => {
    const ul = document.getElementById('lista-canciones');
    data.forEach(c => {
      const li = document.createElement('li');
      li.textContent = c.cancion;
      ul.appendChild(li);
    });
  })
  .catch(err => console.error('Error al obtener canciones:', err));
