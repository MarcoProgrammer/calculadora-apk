import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';

export default function App() {
  const [montoTotal, setMontoTotal] = useState('');
  const [nuevoNombre, setNuevoNombre] = useState('');
  
  // Lista inicial por defecto basada en el boceto
  const [personas, setPersonas] = useState([
    { id: '1', nombre: 'Roxana', multiplicador: '1' },
    { id: '2', nombre: 'Noemí', multiplicador: '1' },
    { id: '3', nombre: 'Jhony', multiplicador: '1' },
    { id: '4', nombre: 'Olga', multiplicador: '1' },
    { id: '5', nombre: 'Yola', multiplicador: '1' },
  ]);

  // Convertir el monto ingresado a número
  const montoNum = parseFloat(montoTotal.replace(',', '.')) || 0;

  // 1. Preparar multiplicadores y calcular el total de los pesos
  const personasConMultiplicador = personas.map(p => {
    const multNum = parseFloat(p.multiplicador.replace(',', '.')) || 0;
    return { ...p, multNum };
  });
  const sumaMultiplicadores = personasConMultiplicador.reduce((sum, p) => sum + p.multNum, 0);

  // 2. Calcular submontos a 1 decimal
  let sumaTotalRedondeada = 0;
  
  const datosCalculados = personasConMultiplicador.map(p => {
    let submontoCalculado = 0;
    if (sumaMultiplicadores > 0 && montoNum > 0 && p.multNum > 0) {
      const valorReal = (montoNum / sumaMultiplicadores) * p.multNum;
      // Redondear a 1 decimal matemático
      submontoCalculado = Math.round(valorReal * 10) / 10;
    }
    sumaTotalRedondeada += submontoCalculado;
    
    return { 
      ...p, 
      submontoMostrar: submontoCalculado > 0 ? submontoCalculado.toFixed(1) : '' 
    };
  });

  // Funciones de gestión de lista
  const actualizarMultiplicador = (id, valor) => {
    setPersonas(personas.map(p => p.id === id ? { ...p, multiplicador: valor } : p));
  };

  const eliminarPersona = (id) => {
    setPersonas(personas.filter(p => p.id !== id));
  };

  const agregarPersona = () => {
    if (nuevoNombre.trim() !== '') {
      setPersonas([...personas, { id: Date.now().toString(), nombre: nuevoNombre.trim(), multiplicador: '1' }]);
      setNuevoNombre('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        
        {/* ENCABEZADO: Monto */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Monto :</Text>
          <TextInput
            style={styles.montoInput}
            keyboardType="numeric"
            value={montoTotal}
            onChangeText={setMontoTotal}
            placeholder=""
          />
          <Text style={styles.headerText}>Soles</Text>
        </View>

        {/* TÍTULOS DE COLUMNAS */}
        <View style={styles.tableHeader}>
          <Text style={[styles.columnTitle, { flex: 2.5, color: '#FF5733' }]}>Nombre:</Text>
          <Text style={[styles.columnTitle, { flex: 2, color: '#FF5733', textAlign: 'center' }]}>Submonto</Text>
          <Text style={[styles.columnTitle, { flex: 2, color: '#FF5733', textAlign: 'center' }]}>Multiplicador</Text>
          <View style={{ flex: 0.5 }} />
        </View>

        {/* LISTA DE PERSONAS */}
        <ScrollView style={styles.listContainer}>
          {datosCalculados.map((p) => (
            <View key={p.id} style={styles.row}>
              <Text style={styles.nameText} numberOfLines={1}>{p.nombre}</Text>
              
              {/* Casilla Submonto (Solo lectura) */}
              <View style={styles.boxSubmonto}>
                <Text style={styles.submontoText}>{p.submontoMostrar}</Text>
              </View>

              {/* Casilla Multiplicador (Editable) */}
              <View style={styles.boxMultiplicador}>
                <TextInput
                  style={styles.multiplicadorInput}
                  keyboardType="numeric"
                  value={p.multiplicador}
                  onChangeText={(val) => actualizarMultiplicador(p.id, val)}
                />
              </View>

              {/* Botón Eliminar */}
              <TouchableOpacity style={styles.deleteBtn} onPress={() => eliminarPersona(p.id)}>
                <Text style={styles.deleteText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* AGREGAR NUEVA PERSONA */}
        <View style={styles.addRow}>
          <TextInput
            style={styles.addInput}
            placeholder="Agregar nombre..."
            placeholderTextColor="#888"
            value={nuevoNombre}
            onChangeText={setNuevoNombre}
          />
          <TouchableOpacity style={styles.addBtn} onPress={agregarPersona}>
            <Text style={styles.addBtnText}>Agregar</Text>
          </TouchableOpacity>
        </View>

        {/* SUMATORIA FINAL (Casilla Roja) */}
        <View style={styles.footerContainer}>
          <Text style={styles.sigmaText}>Σ</Text>
          <View style={styles.sumBox}>
            <Text style={styles.sumText}>
              {sumaTotalRedondeada > 0 ? sumaTotalRedondeada.toFixed(1) : ''}
            </Text>
          </View>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Fondo oscuro como en el boceto
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'sans-serif-medium',
  },
  montoInput: {
    borderWidth: 1,
    borderColor: '#64B5F6',
    width: 120,
    height: 45,
    marginHorizontal: 10,
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  nameText: {
    flex: 2.5,
    color: '#fff',
    fontSize: 20,
  },
  boxSubmonto: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#64B5F6',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 4,
  },
  submontoText: {
    color: '#fff',
    fontSize: 18,
  },
  boxMultiplicador: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#64B5F6',
    height: 35,
    justifyContent: 'center',
    borderRadius: 4,
  },
  multiplicadorInput: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    height: '100%',
  },
  deleteBtn: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  deleteText: {
    color: '#EF5350',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addRow: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  addInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#555',
    color: '#fff',
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 10,
  },
  addBtn: {
    backgroundColor: '#333',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 16,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
    marginTop: 10,
  },
  sigmaText: {
    color: '#EF5350',
    fontSize: 35,
    marginRight: 15,
  },
  sumBox: {
    borderWidth: 2,
    borderColor: '#EF5350', // Casilla roja de la parte inferior
    width: 120,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  sumText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  }
});
