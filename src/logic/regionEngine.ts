export type Country = 'India' | 'USA' | 'Global';
export type State = 'Tamil Nadu' | 'Kerala' | 'Karnataka' | 'Maharashtra' | 'California' | 'Texas' | 'Any';

export interface LocationData {
  country: Country;
  state: State;
}

export const regionEngine = {
  getRegionalKeywords(location: LocationData): string[] {
    const keywords: string[] = [];

    // Country level keywords
    if (location.country === 'India') keywords.push('indian', 'curry', 'masala', 'roti', 'rice');
    if (location.country === 'USA') keywords.push('american', 'burger', 'steak', 'salad', 'pancake');

    // State level keywords
    switch (location.state) {
      case 'Tamil Nadu':
        keywords.push('idli', 'dosa', 'sambar', 'chutney', 'kurma', 'pongal', 'rasam', 'chettinad');
        break;
      case 'Kerala':
        keywords.push('appam', 'stew', 'coconut', 'fish curry', 'puttu');
        break;
      case 'Karnataka':
        keywords.push('bisi bele bath', 'neer dosa', 'ragi mudde');
        break;
      case 'Maharashtra':
        keywords.push('poha', 'misal', 'pav bhaji', 'vada pav');
        break;
      case 'California':
        keywords.push('avocado toast', 'smoothie bowl', 'sushi', 'taco');
        break;
      case 'Texas':
        keywords.push('bbq', 'brisket', 'tex-mex', 'chili');
        break;
    }

    return keywords.map(k => k.toLowerCase());
  },

  calculateRegionMatchScore(mealName: string, location: LocationData): number {
    const keywords = this.getRegionalKeywords(location);
    const lowerName = mealName.toLowerCase();
    
    // If the meal name contains any of the regional keywords, boost it significantly
    for (const kw of keywords) {
      if (lowerName.includes(kw)) {
        return 40; // High score boost for a cultural match
      }
    }
    return 0;
  }
};
