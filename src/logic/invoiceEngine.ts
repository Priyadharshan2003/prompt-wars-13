export interface InvoiceResult {
  scannedTotal: number;
  savedAmount: number;
  isOverbudget: boolean;
  message: string;
}

export const invoiceEngine = {
  /**
   * Mock parser for the uploaded/captured invoice image.
   * In a real production app, this would send `imageUri` to an OCR API (like Google Cloud Vision or Supabase Edge Function).
   * Here, we simulate parsing by randomly generating a total that is somewhat close to the planned budget.
   */
  async processInvoice(imageUri: string, plannedBudget: number): Promise<InvoiceResult> {
    // Simulate network delay for OCR
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate OCR finding a total cost. 
    // Randomly varies between 80% to 120% of the planned budget to show both saving and overspending states.
    const variance = (Math.random() * 0.4) + 0.8; 
    let scannedTotal = plannedBudget * variance;
    
    // Round to 2 decimal places
    scannedTotal = Math.round(scannedTotal * 100) / 100;

    const savedAmount = plannedBudget - scannedTotal;
    const isOverbudget = savedAmount < 0;

    let message = '';
    if (isOverbudget) {
      message = `You overspent by $${Math.abs(savedAmount).toFixed(2)}`;
    } else {
      message = `You saved $${savedAmount.toFixed(2)}`;
    }

    return {
      scannedTotal,
      savedAmount,
      isOverbudget,
      message
    };
  }
};
