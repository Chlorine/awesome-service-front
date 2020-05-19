import {
  DaDataFioSuggestion,
  DaDataGender,
  DaDataNamePart
} from '../../back/common/dadata';

export class DaDataFioCache {
  private items: { [key: string]: DaDataFioSuggestion[] } = {};

  private static makeKey(
    query: string,
    namePart: DaDataNamePart,
    gender: DaDataGender,
  ) {
    return `${namePart}_${gender}_${query}`;
  }

  get(
    query: string,
    namePart: DaDataNamePart,
    gender: DaDataGender,
  ): DaDataFioSuggestion[] | null {
    const suggestions = this.items[
      DaDataFioCache.makeKey(query, namePart, gender)
    ];
    if (suggestions) {
      console.log(
        `DaDataCache.get('${query}', '${namePart}', '${gender}'): hit! (${suggestions.length})`,
      );
      return suggestions;
    }

    console.log(`DaDataCache.get('${query}', '${namePart}'): miss!`);
    return null;
  }

  set(
    query: string,
    namePart: DaDataNamePart,
    suggestions: DaDataFioSuggestion[],
    gender: DaDataGender = 'UNKNOWN',
  ) {
    this.items[DaDataFioCache.makeKey(query, namePart, gender)] = suggestions;
  }
}
