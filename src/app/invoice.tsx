import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, useColorScheme, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Colors } from '@/styles/theme';
import { useApp } from '@/logic/AppContext';
import { invoiceEngine, InvoiceResult } from '@/logic/invoiceEngine';
import { Api } from '@/logic/api';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Ionicons } from '@expo/vector-icons';

export default function InvoiceScreen() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];
  const { session, isGuest, currentPlan } = useApp();
  
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<InvoiceResult | null>(null);

  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={styles.container}><ActivityIndicator /></View>;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, marginBottom: 16 }}>We need camera access to scan your receipts.</Text>
        <Button title="Grant Permission" onPress={requestPermission} variant="primary" />
      </View>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    
    setIsProcessing(true);
    setIsScanning(false);

    try {
      // In a real app we'd get the photo: 
      // const photo = await cameraRef.current.takePictureAsync();
      
      const budget = currentPlan ? currentPlan.adjustedTotalCost : 20.0;
      const res = await invoiceEngine.processInvoice('dummy-uri', budget);
      
      // Save to Supabase
      const userId = session?.user.id;
      if (userId && !isGuest) {
        // Find meal plan ID from currentPlan if we had one stored. 
        // For now, we pass null as mealPlanId since currentPlan doesn't have its UUID stored in context yet.
        await Api.saveInvoice(userId, null, res.scannedTotal, res.savedAmount, 'dummy-image-url');
      }

      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetake = () => {
    setResult(null);
    setIsScanning(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Receipt Scanner</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Compare actual spend vs planned budget
        </Text>
      </View>

      {!isScanning && !result && !isProcessing && (
        <View style={styles.startContainer}>
          <Ionicons name="receipt-outline" size={80} color={colors.primary} style={{ marginBottom: 20 }} />
          <Text style={[styles.infoText, { color: colors.textSecondary, marginBottom: 30, textAlign: 'center' }]}>
            Scan your grocery receipt to see if you stayed within your ${currentPlan?.adjustedTotalCost || 20} budget!
          </Text>
          <Button 
            title="Start Scanner" 
            onPress={() => setIsScanning(true)} 
            variant="primary" 
          />
        </View>
      )}

      {isScanning && (
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} ref={cameraRef} facing="back">
            <View style={styles.cameraOverlay}>
              <View style={styles.scanTarget} />
            </View>
          </CameraView>
          <View style={[styles.cameraControls, { backgroundColor: colors.background }]}>
            <Button title="Cancel" onPress={() => setIsScanning(false)} variant="outline" style={{ flex: 1, marginRight: 8 }} />
            <Button title="Capture" onPress={handleCapture} variant="primary" style={{ flex: 1, marginLeft: 8 }} />
          </View>
        </View>
      )}

      {isProcessing && (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color={colors.primary} style={{ marginBottom: 20 }} />
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>Analyzing Receipt with AI...</Text>
        </View>
      )}

      {result && (
        <View style={styles.resultContainer}>
          <Card variant="default" style={{ width: '100%', alignItems: 'center', padding: 24 }}>
            <Ionicons 
              name={result.isOverbudget ? "warning-outline" : "checkmark-circle-outline"} 
              size={64} 
              color={result.isOverbudget ? colors.warning : colors.success} 
              style={{ marginBottom: 16 }} 
            />
            
            <Text style={[styles.resultTitle, { color: colors.text }]}>
              {result.isOverbudget ? 'Over Budget!' : 'Budget Goal Achieved!'}
            </Text>
            
            <View style={styles.resultRow}>
              <Text style={{ color: colors.textSecondary }}>Planned Budget:</Text>
              <Text style={{ color: colors.text, fontWeight: '600' }}>
                ${(currentPlan?.adjustedTotalCost || 20).toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.resultRow}>
              <Text style={{ color: colors.textSecondary }}>Scanned Total:</Text>
              <Text style={{ color: colors.text, fontWeight: '600' }}>
                ${result.scannedTotal.toFixed(2)}
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <Text style={[styles.resultMessage, { color: result.isOverbudget ? colors.warning : colors.success }]}>
              {result.message}
            </Text>

            <Button title="Scan Another" onPress={handleRetake} variant="primary" style={{ marginTop: 24, width: '100%' }} />
          </Card>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanTarget: {
    width: '80%',
    height: '60%',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  cameraControls: {
    flexDirection: 'row',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -16,
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 16,
  },
  resultMessage: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  }
});
