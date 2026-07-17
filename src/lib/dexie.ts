import Dexie, { Table } from 'dexie';
import { Workout, Split, BodyWeightEntry, PersonalRecord, Template } from './types';

// Extended types for DB
export interface SettingRecord {
  id?: number;
  key: string;
  value: any;
}

// Since Dexie uses id, we need to make sure types align.
// Workout, Split, BodyWeightEntry, PersonalRecord already have `id` as string or number in types.ts.

export class LiftPulseDB extends Dexie {
  workouts!: Table<Workout, string | number>;
  splits!: Table<Split, string>;
  bodyweights!: Table<BodyWeightEntry, string>;
  prs!: Table<PersonalRecord, string>;
  settings!: Table<SettingRecord, number>;
  templates!: Table<Template, string>;
  exercises_library!: Table<any, string>;

  constructor() {
    super('LiftPulseDB');
    this.version(1).stores({
      workouts: '++id, startedAt', // startedAt is for sorting
      splits: 'id',
      bodyweights: 'id, date',
      prs: 'id, exerciseId',
      settings: '++id, &key' // unique key
    });
    this.version(2).stores({
      workouts: '++id, startedAt',
      splits: 'id',
      bodyweights: 'id, date',
      prs: 'id, exerciseId',
      settings: '++id, &key',
      templates: 'id, lastUsed, createdAt'
    });
    this.version(3).stores({
      workouts: '++id, startedAt',
      splits: 'id',
      bodyweights: 'id, date',
      prs: 'id, exerciseId',
      settings: '++id, &key',
      templates: 'id, lastUsed, createdAt',
      exercises_library: 'id, name, category'
    });
  }
}

export const db = new LiftPulseDB();

